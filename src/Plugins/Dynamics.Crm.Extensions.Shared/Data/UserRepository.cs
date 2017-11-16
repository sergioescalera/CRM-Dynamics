using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class UserRepository : Repository
    {
        static readonly Guid SystemAdminRoleTemplateId = Guid.Parse("627090FF-40A3-4053-8790-584EDC5BE201");

        public UserRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public UserRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return SystemUserEntity.TypeName;
            }
        }

        public virtual Boolean IsInRole(Guid userId, Guid roleId)
        {
            var query = $@"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false' >
    <entity name='role' >
        <attribute name='name' />
        <link-entity name='systemuserroles' from='roleid' to='roleid' >
            <filter><condition operator='eq' attribute='systemuserid' value='{userId}' /></filter>
        </link-entity>
        <filter><condition operator='eq' attribute='roleid' value='{roleId}' /></filter>
    </entity>
</fetch>";

            return Service.FetchAll(query).Any();
        }

        public virtual Boolean IsSystemAdministrator(Guid userId)
        {
            var query = $@"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false' >
    <entity name='role' >
        <attribute name='name' />
        <link-entity name='systemuserroles' from='roleid' to='roleid' >
            <filter><condition operator='eq' attribute='systemuserid' value='{userId}' /></filter>
        </link-entity>
        <filter><condition operator='eq' attribute='roletemplateid' value='{SystemAdminRoleTemplateId}' /></filter>
    </entity>
</fetch>";

            return Service.FetchAll(query).Any();
        }
    }
}
