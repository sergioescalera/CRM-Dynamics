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
            var entity = Service.Retrieve(
                EntityName,
                accountId,
                AccountEntity.IdFieldName,
                AccountEntity.ParentAccountFieldName,
                AccountEntity.PrimaryContactFieldName,
                Common.NameFieldName,
                Common.StateFieldName,
                Common.StatusFieldName);
            
            return entity == null ? null : new Account
            {
                Id = entity.Id,
                Name = entity.GetAttributeValue<String>(Common.NameFieldName),
                ParentAccount = entity.GetAttributeValue<EntityReference>(AccountEntity.ParentAccountFieldName),
                PrimaryContact = entity.GetAttributeValue<EntityReference>(AccountEntity.PrimaryContactFieldName),
                State = entity.GetAttributeValue<OptionSetValue>(Common.StateFieldName).ToEnum<StateCode>().Value,
                Status = entity.GetAttributeValue<OptionSetValue>(Common.StatusFieldName).ToEnum<StatusCode>().Value
            };
        }

        public virtual IEnumerable<Account> FindByName(String name)
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<String>(Common.NameFieldName) == name
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(AccountEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            ParentAccount = o.GetAttributeValue<EntityReference>(AccountEntity.ParentAccountFieldName),
                            PrimaryContact = o.GetAttributeValue<EntityReference>(AccountEntity.PrimaryContactFieldName),
                            State = o.GetAttributeValue<OptionSetValue>(Common.StateFieldName),
                            Status = o.GetAttributeValue<OptionSetValue>(Common.StatusFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new Account
                {
                    Id = o.Id,
                    Name = o.Name,
                    ParentAccount = o.ParentAccount,
                    PrimaryContact = o.PrimaryContact,
                    State = o.State.ToEnum<StateCode>().Value,
                    Status = o.Status.ToEnum<StatusCode>().Value
                })
                .ToArray();
        }
    }
}