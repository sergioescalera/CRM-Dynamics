using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class LogEntry : IEntity
    {
        private readonly string _prefix;

        public LogEntry(
            String name,
            String message,
            String description,
            String source,
            LogEntryType type = LogEntryType.Error,
            String prefix = Schema.DefaultPrefix)
        {
            this.EnsureNotNull(prefix, nameof(prefix));

            _prefix = prefix;

            Name = name?.Left(Schema.LogEntryEntity.NameFieldLength);
            Message = message?.Left(Schema.LogEntryEntity.MessageFieldLength);
            Description = description?.Right(Schema.LogEntryEntity.DescriptionFieldLength);
            Source = source?.Left(Schema.LogEntryEntity.SourceFieldLength);
            Type = type;
        }

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
                return LogEntryEntity.TypeName(_prefix);
            }
        }

        public static LogEntry CreateFromException(
            Exception exception,
            String name,
            String trace,
            String source = "Plugin",
            LogEntryType type = LogEntryType.Error,
            String prefix = Schema.DefaultPrefix)
        {
            ValidationHelper.EnsureNotNull(exception);
            ValidationHelper.EnsureNotNull(name);

            var message = exception.Message;
            var description = $"EXCEPTION:{exception.ToString()}\nTRACE:{trace}";

            var entry = new LogEntry(name, message, description, source, type, prefix);
            
            return entry;
        }
    }
}
