using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Plugins
{
    [PipelineStage(PipelineStage.PreOperation)]
    [PipelineExecutionMode(ExecutionMode.Synchronous)]
    [PipelineMessage(Messages.Create, Messages.Update)]
    public class GlobalSettingValidationPlugin : PluginBase
    {
        private readonly string _prefix;

        public GlobalSettingValidationPlugin(String prefix)
        {
            _prefix = prefix ?? Schema.DefaultPrefix;
        }

        protected override void Execute(IPluginContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            context.EnsureTargetLogicalName(GlobalSettingEntity.TypeName(_prefix));

            var target = context
                .GetTargetEntity();
            var image = context
                .GetEntityImage(EntityImageType.PreImage, throwIfNull: context.IsUpdateMessage());

            var type = target
                .GetAttributeValue<OptionSetValue>(GlobalSettingEntity.TypeFieldName(_prefix), image)?
                .ToEnum<GlobalSettingType>() ?? GlobalSettingType.String;
            var value = target
                .GetAttributeValue<String>(GlobalSettingEntity.ValueFieldName(_prefix), image);

            ValidateValue(type, value);
            SanitizeValue(target, type, value);
        }

        private void ValidateValue(GlobalSettingType type, String value)
        {
            switch (type)
            {
                case GlobalSettingType.String:
                    break;
                case GlobalSettingType.Int:
                    ValidateIntValue(value);
                    break;
                case GlobalSettingType.Decimal:
                    ValidateDecimalValue(value);
                    break;
                case GlobalSettingType.Boolean:
                    ValidateBooleanValue(value);
                    break;
                case GlobalSettingType.Reference:
                    ValidateReferenceValue(value);
                    break;
                default:
                    break;
            }
        }

        private void ValidateBooleanValue(String str)
        {
            var value = default(Boolean);
            if (!Boolean.TryParse(str, out value))
                throw new InvalidPluginExecutionException($"Invalid boolean value");
        }

        private void ValidateDecimalValue(String str)
        {
            var value = Decimal.Zero;
            if (!Decimal.TryParse(str, out value))
                throw new InvalidPluginExecutionException($"Invalid decimal value");
        }

        private void ValidateIntValue(String str)
        {
            var value = 0;
            if (!Int32.TryParse(str, out value))
                throw new InvalidPluginExecutionException($"Invalid integer value");
        }

        private void ValidateReferenceValue(String str)
        {
            var value = Guid.Empty;
            if (!Guid.TryParse(str, out value))
                throw new InvalidPluginExecutionException($"Invalid Guid value");
        }

        private void SanitizeValue(Entity target, GlobalSettingType type, String value)
        {
            if (value == null)
                return;

            if (type == GlobalSettingType.String)
                return;

            target.AddOrUpdateAttribute(GlobalSettingEntity.ValueFieldName(_prefix), value.Trim().ToLower());
        }
    }
}
