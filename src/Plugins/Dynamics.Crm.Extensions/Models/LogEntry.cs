using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Models
{
    public class LogEntry : IEntity
    {
        public LogEntry(
            String name,
            String message,
            String description,
            String source,
            LogEntryType type = LogEntryType.Error)
        {
            Name = name?.Left(Schema.LogEntryEntity.NameFieldLength);
            Message = message?.Left(Schema.LogEntryEntity.MessageFieldLength);
            Description = description?.Left(Schema.LogEntryEntity.DescriptionFieldLength);
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
                return Schema.LogEntryEntity.TypeName;
            }
        }

        public static LogEntry CreateFromException(
            Exception exception,
            String name,
            String source = "Plugin",
            LogEntryType type = LogEntryType.Error)
        {
            ValidationHelper.EnsureNotNull(exception);
            ValidationHelper.EnsureNotNull(name);

            var message = exception.Message;
            var description = exception.ToString();

            var entry = new LogEntry(name, message, description, source, type);
            
            return entry;
        }
    }
}
