using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class Product : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public String Number
        {
            get; set;
        }

        public EntityReference DefaultUnit
        {
            get; set;
        }

        public EntityReference UnitGroup
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return ProductEntity.TypeName;
            }
        }
    }
}
