using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class LogEntryRepository : Repository, ILogEntryRepository
    {
        private readonly string _prefix;

        public LogEntryRepository(String prefix, IPluginContext pluginContext)
            : this(prefix, pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public LogEntryRepository(String prefix, IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
            this.EnsureNotNull(prefix, nameof(prefix));

            _prefix = prefix;
        }

        protected override String EntityName
        {
            get
            {
                return LogEntryEntity.TypeName(_prefix);
            }
        }

        public virtual Guid Create(LogEntry logEntry, Boolean useCurrentTransaction = false)
        {
            if (logEntry == null)
                throw new ArgumentNullException(nameof(logEntry));

            var entity = new Entity(logEntry.TypeName);

            entity.AddOrUpdateAttribute(LogEntryEntity.DescriptionFieldName(_prefix), logEntry.Description);
            entity.AddOrUpdateAttribute(LogEntryEntity.MessageFieldName(_prefix), logEntry.Message);
            entity.AddOrUpdateAttribute(Common.CustomNameFieldName(_prefix), logEntry.Name);
            entity.AddOrUpdateAttribute(LogEntryEntity.SourceFieldName(_prefix), logEntry.Source);
            entity.AddOrUpdateAttribute(LogEntryEntity.TypeFieldName(_prefix), logEntry.Type.ToOptionSetValue());
            entity.AddOrUpdateAttribute(LogEntryEntity.UserFieldName(_prefix), logEntry.User);

            if (useCurrentTransaction)
            {
                return PluginContext.OrganizationService.Create(entity);
            }
            else
            {
                var request = new ExecuteMultipleRequest
                {
                    Requests = new OrganizationRequestCollection(),
                    Settings = new ExecuteMultipleSettings
                    {
                        ContinueOnError = true,
                        ReturnResponses = true
                    }
                };

                request.Requests.Add(new CreateRequest
                {
                    Target = entity
                });

                var response = PluginContext.OrganizationService.Execute<ExecuteMultipleResponse>(request);

                var created = response.Responses?.FirstOrDefault()?.Response as CreateResponse;

                return created?.id ?? Guid.Empty;
            }
        }

        public virtual IEnumerable<LogEntry> FindTopNSince(
            String name,
            String message,
            Int32 sinceHours = 1,
            String source = "Plugin",
            LogEntryType type = LogEntryType.Error,
            Int32 top = 1)
        {
            this.EnsureInRange(sinceHours, min: 0, paramName: nameof(sinceHours));

            return FindTopNSince(name, message, DateTime.Now.AddHours(-1 * sinceHours), source, type, top);
        }

        public virtual IEnumerable<LogEntry> FindTopNSince(
            String name,
            String message,
            DateTime since,
            String source = "Plugin",
            LogEntryType type = LogEntryType.Error,
            Int32 top = 1)
        {
            var fetch = $@"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false' count='{top}'>
  <entity name='{LogEntryEntity.TypeName(_prefix)}'>
    <attribute name='{LogEntryEntity.IdFieldName(_prefix)}' />
    <attribute name='{Common.CustomNameFieldName(_prefix)}' />
    <attribute name='{LogEntryEntity.TypeFieldName(_prefix)}' />
    <attribute name='{LogEntryEntity.SourceFieldName(_prefix)}' />
    <attribute name='{LogEntryEntity.MessageFieldName(_prefix)}' />
    <attribute name='{LogEntryEntity.UserFieldName(_prefix)}' />
    <attribute name='{LogEntryEntity.DescriptionFieldName(_prefix)}' />
    <order attribute='{Common.CreatedOnFieldName}' descending='true' />
    <filter type='and'>
      <condition attribute='{Common.CustomNameFieldName(_prefix)}' operator='eq' value='{name}' />
      <condition attribute='{LogEntryEntity.MessageFieldName(_prefix)}' operator='like' value='{message}' />
      <condition attribute='{LogEntryEntity.SourceFieldName(_prefix)}' operator='eq' value='{source}' />
      <condition attribute='{LogEntryEntity.TypeFieldName(_prefix)}' operator='eq' value='{(Int32)type}' />
    </filter>
  </entity>
</fetch>";

            var collection = Service.FetchAll(fetch);

            return collection
                .Select(o => new LogEntry(
                    o.GetAttributeValue<String>(Common.CustomNameFieldName(_prefix)),
                    o.GetAttributeValue<String>(LogEntryEntity.MessageFieldName(_prefix)),
                    o.GetAttributeValue<String>(LogEntryEntity.DescriptionFieldName(_prefix)),
                    o.GetAttributeValue<String>(LogEntryEntity.SourceFieldName(_prefix)),
                    o.GetAttributeValue<OptionSetValue>(LogEntryEntity.TypeFieldName(_prefix))
                     .ToEnum<LogEntryType>()
                     .GetValueOrDefault(),
                    _prefix)
                {
                    Id = o.Id,
                    User = o.GetAttributeValue<EntityReference>(LogEntryEntity.UserFieldName(_prefix))
                })
                .ToArray();
        }
    }
}
