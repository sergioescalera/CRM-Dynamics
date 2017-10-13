using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class AutoNumberingRuleRepository : Repository
    {
        private readonly string _prefix;

        public AutoNumberingRuleRepository(
            String prefix,
            IPluginContext pluginContext)
            : this(prefix, pluginContext, pluginContext?.GetOrganizationServiceContext())
        {   
        }

        public AutoNumberingRuleRepository(
            String prefix,
            IPluginContext pluginContext,
            OrganizationServiceContext context)
            : base(pluginContext, context)
        {
            this.EnsureNotNull(prefix, nameof(prefix));

            _prefix = prefix;
        }

        protected override String EntityName
        {
            get
            {
                return AutoNumberingRuleEntity.TypeName(_prefix);
            }
        }

        public virtual IEnumerable<AutoNumberingRule> GetActiveByEntityName(String entityName)
        {
            this.EnsureNotNullOrEmpty(entityName);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<String>(AutoNumberingRuleEntity.EntityNameFieldName(_prefix)) == entityName
                            && o.GetAttributeValue<OptionSetValue>(Common.StateFieldName).Value == (Int32)StateCode.Active
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(AutoNumberingRuleEntity.IdFieldName(_prefix)),
                            Name = o.GetAttributeValue<String>(Schema.Common.CustomNameFieldName(_prefix)),
                            AttributeName = o.GetAttributeValue<String>(AutoNumberingRuleEntity.AttributeNameFieldName(_prefix)),
                            ConcurrencyToken = o.GetAttributeValue<String>(AutoNumberingRuleEntity.ConcurrencyTokenFieldName(_prefix)),
                            EntityName = o.GetAttributeValue<String>(AutoNumberingRuleEntity.EntityNameFieldName(_prefix)),
                            Format = o.GetAttributeValue<String>(AutoNumberingRuleEntity.FormatFieldName(_prefix)),
                            Type = o.GetAttributeValue<OptionSetValue>(AutoNumberingRuleEntity.TypeFieldName(_prefix)),
                            LastNumberAttributeName = o.GetAttributeValue<String>(
                                AutoNumberingRuleEntity.LastNumberAttributeNameFieldName(_prefix)),
                            LastYearAttributeName = o.GetAttributeValue<String>(
                                AutoNumberingRuleEntity.LastYearAttributeNameFieldName(_prefix)),
                            LastDayAttributeName = o.GetAttributeValue<String>(
                                AutoNumberingRuleEntity.LastDayAttributeNameFieldName(_prefix)),
                            Length = o.GetAttributeValue<Int32?>(AutoNumberingRuleEntity.LengthFieldName(_prefix)),
                            ParentAttributeName = o.GetAttributeValue<String>(
                                AutoNumberingRuleEntity.ParentAttributeNameFieldName(_prefix)),
                            ParentAttributeList = o.GetAttributeValue<String>(
                                AutoNumberingRuleEntity.ParentAttributeListFieldName(_prefix)),
                            UsesFourDigitsYear = o.GetAttributeValue<Boolean?>(
                                AutoNumberingRuleEntity.UsesFourDigitsYearFieldName(_prefix))
                        };

            var array = query.ToArray();

            return array
                .Select(o => new AutoNumberingRule(_prefix)
                {
                    Id = o.Id,
                    Name = o.Name,
                    AttributeName = o.AttributeName,
                    ConcurrencyToken = o.ConcurrencyToken,
                    EntityName = o.EntityName,
                    Format = o.Format,
                    Type = o.Type.ToEnum<AutoNumberingRuleType>() ?? AutoNumberingRuleType.Global,
                    LastNumberAttributeName = o.LastNumberAttributeName,
                    LastYearAttributeName = o.LastYearAttributeName,
                    LastDayAttributeName = o.LastDayAttributeName,
                    Length = o.Length,
                    ParentAttributeName = o.ParentAttributeName,
                    ParentAttributes = (o.ParentAttributeList?
                        .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries) ?? new string[0])
                        .Select(s => s.Trim())
                        .Where(s => !String.IsNullOrEmpty(s))
                        .ToArray(),
                    UsesFourDigitsYear = o.UsesFourDigitsYear ?? false
                })
                .ToArray();
        }
    }
}
