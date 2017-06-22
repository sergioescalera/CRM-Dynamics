using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class BusinessUnitRepository : Repository
    {
        public BusinessUnitRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }
        public BusinessUnitRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return BusinessUnitEntity.TypeName;
            }
        }

        public virtual BusinessUnit GetRoot()
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(BusinessUnitEntity.ParentFieldName) == null
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(BusinessUnitEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            Parent = o.GetAttributeValue<EntityReference>(BusinessUnitEntity.ParentFieldName)
                        };

            var array = query.ToArray();

            return array.Any() ? new BusinessUnit
            {
                Id = array[0].Id,
                Name = array[0].Name,
                Parent = array[0].Parent
            } : null;
        }
    }
}
