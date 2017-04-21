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
    public class UnitRepository : Repository
    {
        public UnitRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public UnitRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return UnitEntity.TypeName;
            }
        }

        public virtual IEnumerable<Unit> GetByUnitGroup(Guid unitGroupId)
        {
            this.EnsureNotEmpty(unitGroupId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(UnitEntity.UnitGroupFieldName).Id == unitGroupId
                        select new Unit
                        {
                            Id = o.GetAttributeValue<Guid>(UnitEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            UnitGroup = o.GetAttributeValue<EntityReference>(UnitEntity.UnitGroupFieldName)
                        };

            var array = query.ToArray();

            return array;
        }
    }
}
