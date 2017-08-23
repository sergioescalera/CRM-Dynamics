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
    public class GlobalSettingRepository : Repository
    {
        private readonly string _prefix;

        public GlobalSettingRepository(String prefix, IPluginContext pluginContext)
            : this(prefix, pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public GlobalSettingRepository(String prefix, IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
            this.EnsureNotNull(prefix, nameof(prefix));

            _prefix = prefix;
        }

        protected override String EntityName
        {
            get
            {
                return GlobalSettingEntity.TypeName(_prefix);
            }
        }

        public virtual IEnumerable<GlobalSetting> GetAll()
        {
            var query = from o in Context.CreateQuery(EntityName)
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(GlobalSettingEntity.IdFieldName(_prefix)),
                            Name = o.GetAttributeValue<String>(Common.CustomNameFieldName(_prefix)),
                            Key = o.GetAttributeValue<String>(GlobalSettingEntity.KeyFieldName(_prefix)),
                            Value = o.GetAttributeValue<String>(GlobalSettingEntity.ValueFieldName(_prefix)),
                            Type = o.GetAttributeValue<OptionSetValue>(GlobalSettingEntity.TypeFieldName(_prefix)),
                            LogicalName = o.GetAttributeValue<String>(GlobalSettingEntity.LogicalNameFieldName(_prefix))
                        };

            var array = query.ToArray();

            return array
                .Select(o => new GlobalSetting(_prefix)
                {
                    Id = o.Id,
                    Key = o.Key,
                    Name = o.Name,
                    Value = o.Value,
                    Type = o.Type.ToEnum<GlobalSettingType>() ?? GlobalSettingType.String,
                    LogicalName = array[0].LogicalName
                }).ToArray();
        }

        public virtual GlobalSetting GetByKey(String key)
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<String>(GlobalSettingEntity.KeyFieldName(_prefix)) == key
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(GlobalSettingEntity.IdFieldName(_prefix)),
                            Name = o.GetAttributeValue<String>(Common.CustomNameFieldName(_prefix)),
                            Key = o.GetAttributeValue<String>(GlobalSettingEntity.KeyFieldName(_prefix)),
                            Value = o.GetAttributeValue<String>(GlobalSettingEntity.ValueFieldName(_prefix)),
                            Type = o.GetAttributeValue<OptionSetValue>(GlobalSettingEntity.TypeFieldName(_prefix)),
                            LogicalName = o.GetAttributeValue<String>(GlobalSettingEntity.LogicalNameFieldName(_prefix))
                        };

            var array = query.ToArray();

            return array.Any() ? new GlobalSetting(_prefix)
            {
                Id = array[0].Id,
                Key = array[0].Key,
                Name = array[0].Name,
                Value = array[0].Value,
                Type = array[0].Type.ToEnum<GlobalSettingType>() ?? GlobalSettingType.String,
                LogicalName = array[0].LogicalName
            } : null;
        }
    }
}
