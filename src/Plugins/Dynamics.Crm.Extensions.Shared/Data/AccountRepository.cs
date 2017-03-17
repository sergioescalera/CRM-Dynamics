using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class AccountRepository : Repository
    {
        public AccountRepository(IPluginContext context)
            : this(context, context?.GetOrganizationServiceContext())
        {
        }

        public AccountRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return AccountEntity.TypeName;
            }
        }

        public virtual Account GetById(Guid accountId)
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<Guid>(AccountEntity.IdFieldName) == accountId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(AccountEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            ParentAccount = o.GetAttributeValue<EntityReference>(AccountEntity.ParentAccountFieldName)
                        };

            var array = query.ToArray();

            return array.Any() ? new Account
            {
                Id = array[0].Id,
                Name = array[0].Name,
                ParentAccount = array[0].ParentAccount
            } : null;
        }
    }
}