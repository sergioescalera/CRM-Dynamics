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
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<Guid>(ContactEntity.IdFieldName) == contactId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(ContactEntity.IdFieldName),
                            FullName = o.GetAttributeValue<String>(ContactEntity.FullNameFieldName),
                            ParentCustomer = o.GetAttributeValue<EntityReference>(ContactEntity.ParentCustomerFieldName),
                            Email = o.GetAttributeValue<String>(ContactEntity.EmailFieldName),
                            MobilePhone = o.GetAttributeValue<String>(ContactEntity.MobilePhoneFieldName),
                            Phone = o.GetAttributeValue<String>(ContactEntity.PhoneFieldName),
                            State = o.GetAttributeValue<OptionSetValue>(Common.StateFieldName),
                            Status = o.GetAttributeValue<OptionSetValue>(Common.StatusFieldName)
                        };

            var array = query.ToArray();

            return array.Any() ? new Contact
            {
                Id = array[0].Id,
                FullName = array[0].FullName,
                ParentCustomer = array[0].ParentCustomer,
                Email = array[0].Email,
                MobilePhone = array[0].MobilePhone,
                Phone = array[0].Phone,
                State = array[0].State.ToEnum<StateCode>().Value,
                Status = array[0].Status.ToEnum<StatusCode>().Value
            } : null;
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
                    State = o.State.ToEnum<StateCode>().Value,
                    Status = o.Status.ToEnum<StatusCode>().Value
                })
                .ToArray();
        }
    }
}