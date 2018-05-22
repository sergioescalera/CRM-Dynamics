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
            var entity = Service.Retrieve(
                EntityName,
                contactId,
                ContactEntity.IdFieldName,
                ContactEntity.FullNameFieldName,
                ContactEntity.ParentCustomerFieldName,
                ContactEntity.EmailFieldName,
                ContactEntity.MobilePhoneFieldName,
                ContactEntity.PhoneFieldName,
                Common.StateFieldName,
                Common.StatusFieldName);
            
            return entity == null ? null : new Contact
            {
                Id = entity.Id,
                FullName = entity.GetAttributeValue<String>(ContactEntity.FullNameFieldName),
                ParentCustomer = entity.GetAttributeValue<EntityReference>(ContactEntity.ParentCustomerFieldName),
                Email = entity.GetAttributeValue<String>(ContactEntity.EmailFieldName),
                MobilePhone = entity.GetAttributeValue<String>(ContactEntity.MobilePhoneFieldName),
                Phone = entity.GetAttributeValue<String>(ContactEntity.PhoneFieldName),
                State = entity.GetAttributeValue<OptionSetValue>(Common.StateFieldName).ToEnum<StateCode>().Value,
                Status = entity.GetAttributeValue<OptionSetValue>(Common.StatusFieldName).ToEnum<StatusCode>().Value
            };
        }

        public virtual IEnumerable<Contact> FindByNameAndEmail(String name, String email)
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<String>(ContactEntity.FullNameFieldName) == name
                            && o.GetAttributeValue<String>(ContactEntity.EmailFieldName) == email
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(ContactEntity.IdFieldName),
                            FullName = o.GetAttributeValue<String>(ContactEntity.FullNameFieldName),
                            ParentCustomer = o.GetAttributeValue<EntityReference>(ContactEntity.ParentCustomerFieldName),
                            Email = o.GetAttributeValue<String>(ContactEntity.EmailFieldName),
                            MobilePhone = o.GetAttributeValue<String>(ContactEntity.MobilePhoneFieldName),
                            Phone = o.GetAttributeValue<String>(ContactEntity.PhoneFieldName),
                            Fax = o.GetAttributeValue<String>(ContactEntity.FaxFieldName),
                            State = o.GetAttributeValue<OptionSetValue>(Common.StateFieldName),
                            Status = o.GetAttributeValue<OptionSetValue>(Common.StatusFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new Contact
                {
                    Id = o.Id,
                    FullName = o.FullName,
                    ParentCustomer = o.ParentCustomer,
                    Email = o.Email,
                    MobilePhone = o.MobilePhone,
                    Phone = o.Phone,
                    Fax = o.Fax,
                    State = o.State.ToEnum<StateCode>().Value,
                    Status = o.Status.ToEnum<StatusCode>().Value
                })
                .ToArray();
        }
    }
}