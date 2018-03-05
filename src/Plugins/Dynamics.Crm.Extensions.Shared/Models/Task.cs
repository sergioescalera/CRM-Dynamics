using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class Task : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return TaskEntity.TypeName;
            }
        }

        public EntityReference RegardingObject
        {
            get; set;
        }

        public EntityReference Owner
        {
            get; set;
        }

        public String Subject
        {
            get; set;
        }

        public String Description
        {
            get; set;
        }

        public DateTime? ActualStart
        {
            get; set;
        }

        public DateTime? ScheduledStart
        {
            get; set;
        }

        public DateTime? ActualEnd
        {
            get; set;
        }

        public DateTime? ScheduledEnd
        {
            get; set;
        }

        public TaskStateCode State
        {
            get; set;
        }

        public TaskStatusCode Status
        {
            get; set;
        }
    }
}
