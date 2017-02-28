using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;
using System;
using System.Linq;

namespace Dynamics.Crm.Data
{
    public class LogEntryRepository : Repository, ILogEntryRepository
    {
        public LogEntryRepository(IPluginContext pluginContext)
            : this(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public LogEntryRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return Schema.LogEntryEntity.TypeName;
            }
        }

        public virtual Guid Create(LogEntry logEntry, Boolean useCurrentTransaction = false)
        {
            if (logEntry == null)
                throw new ArgumentNullException(nameof(logEntry));

            var entity = new Entity(logEntry.TypeName);

            entity.AddOrUpdateAttribute(Schema.LogEntryEntity.DescriptionFieldName, logEntry.Description);
            entity.AddOrUpdateAttribute(Schema.LogEntryEntity.MessageFieldName, logEntry.Message);
            entity.AddOrUpdateAttribute(Schema.LogEntryEntity.NameFieldName, logEntry.Name);
            entity.AddOrUpdateAttribute(Schema.LogEntryEntity.SourceFieldName, logEntry.Source);
            entity.AddOrUpdateAttribute(Schema.LogEntryEntity.TypeFieldName, logEntry.Type.ToOptionSetValue());
            entity.AddOrUpdateAttribute(Schema.LogEntryEntity.UserFieldName, logEntry.User);

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
    }
}
