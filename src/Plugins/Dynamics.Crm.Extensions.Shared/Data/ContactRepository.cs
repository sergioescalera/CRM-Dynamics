using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class ContactRepository : Repository
    {
        public ContactRepository(IPluginContext context)
            : this(context, context?.GetOrganizationServiceContext())
        {
        }

        public ContactRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return ContactEntity.TypeName;
            }
        }

        public virtual Contact GetById(Guid contactId)
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<Guid>(ContactEntity.IdFieldName) == contactId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(ContactEntity.IdFieldName),
                            FullName = o.GetAttributeValue<String>(ContactEntity.FullNameFieldName),
                            ParentCustomer = o.GetAttributeValue<EntityReference>(ContactEntity.ParentCustomerFieldName)
                        };

            var array = query.ToArray();

            return array.Any() ? new Contact
            {
                FullName = array[0].FullName,
                Id = array[0].Id,
                ParentCustomer = array[0].ParentCustomer
            } : null;
        }
    }
}
