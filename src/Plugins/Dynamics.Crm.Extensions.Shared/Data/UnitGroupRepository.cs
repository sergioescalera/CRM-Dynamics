using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class UnitGroupRepository : Repository
    {
        public UnitGroupRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public UnitGroupRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return UnitGroupEntity.TypeName;
            }
        }

        public virtual IEnumerable<UnitGroup> GetAll()
        {
            var query = from o in Context.CreateQuery(EntityName)
                        select new UnitGroup
                        {
                            Id = o.GetAttributeValue<Guid>(UnitGroupEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName)
                        };

            var array = query.ToArray();

            return array;
        }
    }
}
