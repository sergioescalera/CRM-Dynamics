using Dynamics.Crm.Attributes;
using Dynamics.Crm.Concurrency;
using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Plugins
{
    [PipelineStage(PipelineStage.PreOperation, PipelineStage.PreValidation)]
    [PipelineExecutionMode(ExecutionMode.Synchronous)]
    [PipelineMessage(Messages.Create)]
    public class GenerateNumberOnCreatePlugin : PluginBase
    {
        private readonly string _prefix;

        public GenerateNumberOnCreatePlugin(String prefix)
        {
            _prefix = prefix ?? "cc";
        }

        protected override void Execute(IPluginContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            var target = context.GetTargetEntity();

            var repository = new AutoNumberingRuleRepository(_prefix, context);

            var rules = repository.GetActiveByEntityName(target.LogicalName);

            context.TracingService.Trace($"Found {rules.Count()} auto-numbering rules for {target.LogicalName}");

            if (!rules.Any())
                return;

            var rule = rules.First();

            var number = target.GetAttributeValue<String>(rule.AttributeName);

            context.TracingService.Trace($"Found {rule.AttributeName}={number}");
            
            if (!number.IsNullOrEmpty())
                return;

            var stage = (PipelineStage)context.ExecutionContext.Stage;

            if (stage != PipelineStage.PreValidation && !rule.Lock(context, Common.ConcurrencyTokenFieldName(_prefix)))
                throw new InvalidPluginExecutionException(
                    "Unable to lock rule entity. Plug-in should run within the context of a transaction.");

            var today = DateTime.Today;

            var parent = GetParentEntity(context, target, rule);

            var lastNumber = GetLastNumber(context, rule, parent, today);

            var nextNumber = lastNumber + 1;

            ValidateNumber(rule, nextNumber);

            var formatted = Formatted(rule, today, target, parent, nextNumber);

            target.AddOrUpdateAttribute(rule.AttributeName, formatted);

            if (rule.IsParented())
            {
                UpdateParent(context, rule, parent.ToEntityReference(), nextNumber, today);
            }
            else
            {
                UpdateRule(context, rule, nextNumber, today);
            }
        }

        private Entity GetParentEntity(IPluginContext context, Entity entity, AutoNumberingRule rule)
        {
            if (!rule.IsParented())
                return null;

            if (rule.ParentAttributeName.IsNullOrEmpty())
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing parent attribute name.");

            if (rule.LastNumberAttributeName.IsNullOrEmpty())
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing last number attribute name.");

            var parentReference = entity.GetAttributeValue<EntityReference>(rule.ParentAttributeName);

            if (parentReference == null)
                throw new InvalidPluginExecutionException($"You must provide a value for '{rule.ParentAttributeName}'.");

            var parentAttributes = rule.ParentAttributes
                .Union(new[] { rule.LastNumberAttributeName, rule.LastYearAttributeName, rule.LastDayAttributeName })
                .Where(o => !o.IsNullOrEmpty())
                .Distinct()
                .ToArray();

            var parent = context.OrganizationService.Retrieve(
                parentReference.LogicalName,
                parentReference.Id,
                parentAttributes);

            return parent;
        }

        private Int32 GetLastNumber(IPluginContext context, AutoNumberingRule rule, Entity parent, DateTime today)
        {
            var entityReference = default(EntityReference);
            var lastNumberAttribute = default(String);
            var lastYearAttribute = default(String);
            var lastDayAttribute = default(String);

            if (rule.IsParented())
            {
                entityReference = parent.ToEntityReference();

                lastNumberAttribute = rule.LastNumberAttributeName;
                lastYearAttribute = rule.LastYearAttributeName;
                lastDayAttribute = rule.LastDayAttributeName;
            }
            else
            {
                entityReference = rule.ToEntityReference();

                lastNumberAttribute = AutoNumberingRuleEntity.LastNumberFieldName(_prefix);
                lastYearAttribute = AutoNumberingRuleEntity.LastYearFieldName(_prefix);
                lastDayAttribute = AutoNumberingRuleEntity.LastDayFieldName(_prefix);
            }

            if (lastNumberAttribute.IsNullOrEmpty())
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing last number attribute name.");

            if (rule.IsYearly() && lastYearAttribute.IsNullOrEmpty())
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing last year attribute name.");

            if (rule.IsDaily() && lastDayAttribute.IsNullOrEmpty())
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing last day attribute name.");

            var attributes = new[]
            {
                lastNumberAttribute,
                lastYearAttribute,
                lastDayAttribute
            };

            var entity = context.OrganizationService.Retrieve(
                    entityReference.LogicalName,
                    entityReference.Id,
                    attributes.Where(o => !o.IsNullOrEmpty()).ToArray());

            var number = entity.GetAttributeValue<Int32?>(lastNumberAttribute);
            
            if (rule.IsYearly() && today.Year != entity.GetAttributeValue<Int32?>(lastYearAttribute))
            {
                return 0;
            }
            else if (rule.IsDaily() && today != entity.GetAttributeValue<DateTime?>(lastDayAttribute))
            {
                return 0;
            }

            return number ?? 0;
        }

        private void ValidateNumber(AutoNumberingRule rule, Int32 number)
        {
            if (rule.Length == null)
                return;

            var max = Convert.ToInt32(String.Empty.PadLeft(rule.Length.Value, '9'));

            if (number > max)
                throw new InvalidPluginExecutionException(
                    $"Current number '{number}' is greater than the maximum number '{max}' allowed by the system.");
        }

        private String Formatted(
            AutoNumberingRule rule,
            DateTime today,
            Entity entity,
            Entity parent,
            Int32 number)
        {
            var formatted = DateFormat(rule, today);

            var numberStr = number.ToString();

            if (rule.Length != null)
                numberStr = numberStr.PadLeft(rule.Length.Value, '0');

            formatted = $"{formatted}{ParentFormatted(rule.Format, parent, rule.ParentAttributes)}";

            foreach (var attributeName in entity.Attributes.Keys)
            {
                formatted = formatted.Replace($"[{attributeName}]", DisplayValue(entity.GetAttributeValue<Object>(attributeName)));
            }

            if (formatted.Contains("[number]"))
            {
                return formatted.Replace("[number]", numberStr);
            }
            else
            {
                return $"{formatted}{numberStr}";
            }
        }

        private String DateFormat(AutoNumberingRule rule, DateTime date)
        {
            if (rule.IsDaily())
                return date.ToString(rule.UsesFourDigitsYear ? "yyyyMMdd" : "yyMMdd");

            if (rule.IsYearly())
                return date.ToString(rule.UsesFourDigitsYear ? "yyyy" : "yy");

            return String.Empty;
        }

        private String ParentFormatted(String format, Entity parent, String[] attributes)
        {
            foreach (var attribute in attributes)
            {
                var token = $"[{attribute}]";
                var value = DisplayValue(parent.GetAttributeValue<Object>(attribute));

                if (format.Contains(token))
                    format = format.Replace(token, value);
            }

            return format;
        }

        private String DisplayValue(object value)
        {
            if (value is OptionSetValue)
                return ((OptionSetValue)value).Value.ToString();

            if (value is Money)
                return ((Money)value).Value.ToString();

            return value?.ToString() ?? String.Empty;
        }

        private void UpdateRule(
            IPluginContext context,
            AutoNumberingRule rule,
            Int32 number,
            DateTime date)
        {
            var update = new Entity(rule.TypeName, rule.Id);

            context.TracingService.Trace($"Set {rule.TypeName}.{AutoNumberingRuleEntity.LastNumberFieldName}='{number}'");

            update.AddOrUpdateAttribute(AutoNumberingRuleEntity.LastNumberFieldName(_prefix), number);

            if (rule.IsYearly())
            {
                context.TracingService.Trace($"Set {rule.TypeName}.{AutoNumberingRuleEntity.LastYearFieldName}='{date.Year}'");

                update.AddOrUpdateAttribute(AutoNumberingRuleEntity.LastYearFieldName(_prefix), date.Year);
            }
            else if (rule.IsDaily())
            {
                context.TracingService.Trace($"Set {rule.TypeName}.{AutoNumberingRuleEntity.LastDayFieldName}='{date}'");

                update.AddOrUpdateAttribute(AutoNumberingRuleEntity.LastDayFieldName(_prefix), date);
            }

            context.OrganizationService.Update(update);
        }

        private void UpdateParent(
            IPluginContext context,
            AutoNumberingRule rule,
            EntityReference parent,
            Int32 number,
            DateTime date)
        {
            var update = new Entity(parent.LogicalName, parent.Id);

            context.TracingService.Trace($"Set {parent.LogicalName}.{rule.LastNumberAttributeName}='{number}'");

            update.AddOrUpdateAttribute(rule.LastNumberAttributeName, number);

            if (rule.IsYearly())
            {
                context.TracingService.Trace($"Set {parent.LogicalName}.{rule.LastYearAttributeName}='{date.Year}'");

                update.AddOrUpdateAttribute(rule.LastYearAttributeName, date.Year);
            }
            else if (rule.IsDaily())
            {
                context.TracingService.Trace($"Set {parent.LogicalName}.{rule.LastDayAttributeName}='{date}'");

                update.AddOrUpdateAttribute(rule.LastDayAttributeName, date);
            }

            context.OrganizationService.Update(update);
        }
    }
}
