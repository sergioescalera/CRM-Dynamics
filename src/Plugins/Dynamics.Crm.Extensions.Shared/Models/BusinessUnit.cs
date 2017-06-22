using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class BusinessUnit : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public EntityReference Parent
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return BusinessUnitEntity.TypeName;
            }
        }
    }
}
