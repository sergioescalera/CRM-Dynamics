using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class Team : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public EntityReference Administrator
        {
            get; set;
        }

        public EntityReference BusinessUnit
        {
            get; set;
        }

        public Boolean IsDefault
        {
            get; set;
        }

        public TeamType? Type
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return TeamEntity.TypeName;  
            }
        }
    }
}
