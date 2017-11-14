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
    public class TeamRepository : Repository
    {
        public TeamRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public TeamRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return TeamEntity.TypeName;
            }
        }

        public virtual IEnumerable<Team> GetByBusinessUnit(Guid businessUnitId)
        {
            this.EnsureNotEmpty(businessUnitId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(TeamEntity.BusinessUnitFieldName).Id == businessUnitId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(TeamEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            Administrator = o.GetAttributeValue<EntityReference>(TeamEntity.AdministratorFieldName),
                            BusinessUnit = o.GetAttributeValue<EntityReference>(TeamEntity.BusinessUnitFieldName),
                            IsDefault = o.GetAttributeValue<Boolean?>(TeamEntity.IsDefaultFieldName),
                            Type = o.GetAttributeValue<OptionSetValue>(TeamEntity.TypeFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new Team
                {
                    Administrator = o.Administrator,
                    BusinessUnit = o.BusinessUnit,
                    Id = o.Id,
                    IsDefault = o.IsDefault ?? false,
                    Name = o.Name,
                    Type = o.Type.ToEnum<TeamType>()
                })
                .ToArray();
        }

        public virtual void AddToRole(Guid teamId, Guid roleId)
        {
            PluginContext.OrganizationService.Associate(
               TeamEntity.TypeName,
               teamId,
               new Relationship("teamroles_association"),
               new EntityReferenceCollection
               {
                   new EntityReference(RoleEntity.TypeName, roleId)
               });
        }
    }
}
