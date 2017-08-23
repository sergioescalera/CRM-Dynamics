using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;
using System;
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
    }
}
