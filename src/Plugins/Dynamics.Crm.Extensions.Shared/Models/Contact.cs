using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Models
{
    public class Contact : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return Schema.ContactEntity.TypeName;
            }
        }

        public String FullName
        {
            get; set;
        }

        public EntityReference ParentCustomer
        {
            get; set;
        }
        public String Email
        {
            get; set;
        }

        public String MobilePhone
        {
            get; set;
        }

        public String Phone
        {
            get; set;
        }

        public StateCode State
        {
            get; set;
        }

        public StatusCode Status
        {
            get; set;
        }
    }
}
