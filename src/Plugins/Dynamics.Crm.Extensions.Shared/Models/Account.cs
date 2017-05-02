using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Models
{
    public class Account : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return Schema.AccountEntity.TypeName;
            }
        }


        public String Name
        {
            get; set;
        }

        public EntityReference ParentAccount
        {
            get; set;
        }

        public EntityReference PrimaryContact
        {
            get; set;
        }
    }
}
