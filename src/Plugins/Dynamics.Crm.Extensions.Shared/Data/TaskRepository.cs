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
    public class TaskRepository : Repository
    {
        public TaskRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public TaskRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return TaskEntity.TypeName;
            }
        }

        public virtual Entity Create(Task task)
        {
            this.EnsureNotNull(task, nameof(task));

            var entity = new Entity(task.TypeName);

            entity.AddOrUpdateAttribute(TaskEntity.ActualEndFieldName, task.ActualEnd);
            entity.AddOrUpdateAttribute(TaskEntity.ActualStartFieldName, task.ActualStart);
            entity.AddOrUpdateAttribute(TaskEntity.DescriptionFieldName, task.Description);
            entity.AddOrUpdateAttribute(TaskEntity.RegardingObjectFieldName, task.RegardingObject);
            entity.AddOrUpdateAttribute(TaskEntity.ScheduledEndFieldName, task.ScheduledEnd);
            entity.AddOrUpdateAttribute(TaskEntity.ScheduledStartFieldName, task.ScheduledStart);
            entity.AddOrUpdateAttribute(TaskEntity.SubjectFieldName, task.Subject);
            entity.AddOrUpdateAttribute(Common.OwnerFieldName, task.Owner);

            entity.Id = Service.Create(entity);

            return entity;
        }

        public virtual IEnumerable<Task> GetByRegardingObject(Guid regardingObjectId, TaskStateCode state)
        {
            this.EnsureNotEmpty(regardingObjectId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(TaskEntity.RegardingObjectFieldName).Id == regardingObjectId &&
                            o.GetAttributeValue<OptionSetValue>(Common.StateFieldName).Value == (Int32)state
                        select new
                        {
                            Id = o.Id,
                            ActualEnd = o.GetAttributeValue<DateTime?>(TaskEntity.ActualEndFieldName),
                            ActualStart = o.GetAttributeValue<DateTime?>(TaskEntity.ActualStartFieldName),
                            Description = o.GetAttributeValue<String>(TaskEntity.DescriptionFieldName),
                            RegardingObject = o.GetAttributeValue<EntityReference>(TaskEntity.RegardingObjectFieldName),
                            ScheduledEnd = o.GetAttributeValue<DateTime?>(TaskEntity.ScheduledEndFieldName),
                            ScheduledStart = o.GetAttributeValue<DateTime?>(TaskEntity.ScheduledStartFieldName),
                            Subject = o.GetAttributeValue<String>(TaskEntity.SubjectFieldName),
                            State = o.GetAttributeValue<OptionSetValue>(Common.StateFieldName),
                            Status = o.GetAttributeValue<OptionSetValue>(Common.StatusFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new Task
                {
                    Id = o.Id,
                    ActualEnd = o.ActualEnd,
                    ActualStart = o.ActualStart,
                    Description = o.Description,
                    RegardingObject = o.RegardingObject,
                    ScheduledEnd = o.ScheduledEnd,
                    ScheduledStart = o.ScheduledStart,
                    Subject = o.Subject,
                    State = o.State.ToEnum<TaskStateCode>().Value,
                    Status = o.Status.ToEnum<TaskStatusCode>().Value
                })
                .ToArray();
        }
    }
}
