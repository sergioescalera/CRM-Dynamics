using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Models
{
    public class LogEntry : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public String Message
        {
            get; set;
        }

        public String Description
        {
            get; set;
        }

        public String Source
        {
            get; set;
        }

        public LogEntryType Type
        {
            get; set;
        }

        public EntityReference User
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return Schema.LogEntryEntity.TypeName;
            }
        }
    }
}
