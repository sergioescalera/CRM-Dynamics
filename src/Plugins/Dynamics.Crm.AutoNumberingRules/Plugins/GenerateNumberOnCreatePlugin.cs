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
    [PipelineStage(PipelineStage.PreOperation)]
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

            if (HasNumber(context, target, rule))
                return;

            if (!rule.Lock(context, Common.ConcurrencyTokenFieldName(_prefix)))
                throw new InvalidOperationException();

            if (rule.IsGlobal())
            {
                GenerateNumber(context, target, rule);
            }
            else
            {
                GenerateNumberWithParent(context, target, rule);
            }
        }

        private void GenerateNumber(IPluginContext context, Entity entity, AutoNumberingRule rule)
        {
            var now = DateTime.Now;

            var dateFormat = DateFormat(rule, now);

            var number = GetCurrentNumber(context, rule, dateFormat);

            number++;

            ValidateNumber(rule, number);

            var format = $"{dateFormat}{rule.Format ?? String.Empty}";

            var value = Formatted(entity, format, rule.Length, number);
            
            context.TracingService.Trace($"Set {rule.EntityName}.{rule.AttributeName}='{value}'");

            entity.AddOrUpdateAttribute(rule.AttributeName, value);

            UpdateRule(context, rule, number, now);
        }

        private Int32 GetCurrentNumber(IPluginContext context, AutoNumberingRule rule, String dateFormat)
        {
            if (rule.Type == AutoNumberingRuleType.Parented)
                throw new NotSupportedException();

            if ((rule.Type == AutoNumberingRuleType.GlobalPerYear || rule.Type == AutoNumberingRuleType.GlobalPerDay)
                && !AnyWithPrefix(context, rule, dateFormat))
            {
                return 0;
            }

            var entity = context.OrganizationService.Retrieve(
                rule.TypeName,
                rule.Id,
                AutoNumberingRuleEntity.LastNumberFieldName(_prefix),
                AutoNumberingRuleEntity.LastYearFieldName(_prefix));

            var number = entity.GetAttributeValue<Int32?>(AutoNumberingRuleEntity.LastNumberFieldName(_prefix)) ?? 0;

            return number;
        }

        private Boolean AnyWithPrefix(IPluginContext context, AutoNumberingRule rule, String prefix)
        {
            var query = from o in context.GetOrganizationServiceContext().CreateQuery(rule.EntityName)
                        where o.GetAttributeValue<String>(rule.AttributeName).StartsWith(prefix)
                        select o.GetAttributeValue<String>(rule.AttributeName);

            var first = query.FirstOrDefault();

            return first != null;
        }

        private void GenerateNumberWithParent(IPluginContext context, Entity entity, AutoNumberingRule rule)
        {
            if (String.IsNullOrEmpty(rule.ParentAttributeName))
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing parent attribute name.");

            if (String.IsNullOrEmpty(rule.LastNumberAttributeName))
                throw new InvalidPluginExecutionException("Invalid auto-numbering configuration. Missing last number attribute name.");

            var parentReference = entity.GetAttributeValue<EntityReference>(rule.ParentAttributeName);

            if (parentReference == null)
                throw new InvalidPluginExecutionException($"You must provide a value for '{rule.ParentAttributeName}'.");

            var parent = context.OrganizationService
                .Retrieve(parentReference.LogicalName, parentReference.Id, rule.ParentAttributes
                .Union(new[] { rule.LastNumberAttributeName })
                .ToArray());

            var format = rule.Format ?? String.Empty;

            var number = parent.GetAttributeValue<Int32?>(rule.LastNumberAttributeName) ?? 0;

            number++;

            ValidateNumber(rule, number);

            var formatted = ParentFormatted(format, rule.ParentAttributes, parent);

            var value = Formatted(entity, formatted, rule.Length, number);

            context.TracingService.Trace($"Set {rule.EntityName}.{rule.AttributeName}='{value}'");

            entity.AddOrUpdateAttribute(rule.AttributeName, value);

            UpdateParentLastNumber(context, rule, parent.ToEntityReference(), number);
        }

        private String DateFormat(AutoNumberingRule rule, DateTime date)
        {
            if (rule.Type != AutoNumberingRuleType.GlobalPerYear && rule.Type != AutoNumberingRuleType.GlobalPerDay)
                return String.Empty;

            if (rule.Type == AutoNumberingRuleType.GlobalPerDay && rule.UsesFourDigitsYear)
                return date.ToString("yyyyMMdd");

            if (rule.Type == AutoNumberingRuleType.GlobalPerDay)
                return date.ToString("yyMMdd");

            if (rule.UsesFourDigitsYear)
                return date.ToString("yyyy");

            return date.ToString("yy");
        }

        private String Formatted(Entity entity, String format, Int32? length, Int32 number)
        {
            var numberStr = number.ToString();

            if (length != null)
                numberStr = numberStr.PadLeft(length.Value, '0');

            foreach (var attributeName in entity.Attributes.Keys)
            {
                format = format.Replace($"[{attributeName}]", DisplayValue(entity.GetAttributeValue<Object>(attributeName)));
            }

            if (format.Contains("[number]"))
            {
                return format.Replace("[number]", numberStr);
            }
            else
            {
                return $"{format}{numberStr}";
            }
        }

        private String DisplayValue(object value)
        {
            if (value is OptionSetValue)
                return ((OptionSetValue)value).Value.ToString();

            if (value is Money)
                return ((Money)value).Value.ToString();

            return value?.ToString() ?? String.Empty;
        }

        private String ParentFormatted(String format, String[] attributes, Entity parent)
        {
            foreach (var attribute in attributes)
            {
                var token = $"[{attribute}]";
                var value = parent.GetAttributeValue<Object>(attribute)?.ToString() ?? String.Empty;

                if (format.Contains(token))
                    format = format.Replace(token, value);
            }

            return format;
        }

        private Boolean HasNumber(IPluginContext context, Entity entity, AutoNumberingRule rule)
        {
            var number = entity.GetAttributeValue<String>(rule.AttributeName);

            context.TracingService.Trace($"Found {rule.AttributeName}={number}");

            return !String.IsNullOrEmpty(number);
        }

        private void ValidateNumber(AutoNumberingRule rule, Int32 number)
        {
            if (rule.Length == null)
                return;

            var max = Convert.ToInt32(String.Empty.PadLeft(rule.Length.Value, '9'));

            if (number > max)
                throw new InvalidPluginExecutionException($"Current number '{number}' is greater than the maximum number '{max}' allowed by the system.");
        }

        private void UpdateRule(IPluginContext context, AutoNumberingRule rule, Int32 number, DateTime date)
        {
            var update = new Entity(rule.TypeName, rule.Id);

            context.TracingService.Trace($"Set {rule.TypeName}.{AutoNumberingRuleEntity.LastNumberFieldName}='{number}'");
            update.AddOrUpdateAttribute(AutoNumberingRuleEntity.LastNumberFieldName(_prefix), number);

            if (rule.Type == AutoNumberingRuleType.GlobalPerYear)
            {
                context.TracingService.Trace($"Set {rule.TypeName}.{AutoNumberingRuleEntity.LastYearFieldName}='{date.Year}'");
                update.AddOrUpdateAttribute(AutoNumberingRuleEntity.LastYearFieldName(_prefix), date.Year);
            }

            if (rule.Type == AutoNumberingRuleType.GlobalPerDay)
            {
                context.TracingService.Trace($"Set {rule.TypeName}.{AutoNumberingRuleEntity.LastDayFieldName}='{date.Year}'");
                update.AddOrUpdateAttribute(AutoNumberingRuleEntity.LastDayFieldName(_prefix), date);
            }

            context.OrganizationService.Update(update);
        }

        private void UpdateParentLastNumber(IPluginContext context, AutoNumberingRule rule, EntityReference parent, Int32 number)
        {
            var update = new Entity(parent.LogicalName, parent.Id);

            context.TracingService.Trace($"Set {parent.LogicalName}.{rule.LastNumberAttributeName}='{number}'");
            update.AddOrUpdateAttribute(rule.LastNumberAttributeName, number);

            context.OrganizationService.Update(update);
        }
    }
}
