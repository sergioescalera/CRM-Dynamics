using Dynamics.Crm.Interfaces;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class UnitGroup : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return UnitGroupEntity.TypeName;
            }
        }
    }
}
