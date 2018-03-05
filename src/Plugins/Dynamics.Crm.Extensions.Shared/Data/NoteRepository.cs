using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class NoteRepository : Repository
    {
        public NoteRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public NoteRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return NoteEntity.TypeName;
            }
        }

        public virtual Entity Create(Note note)
        {
            this.EnsureNotNull(note, nameof(note));

            var entity = new Entity(note.TypeName);

            entity.AddOrUpdateAttribute(NoteEntity.DocumentBodyFieldName, note.DocumentBody);
            entity.AddOrUpdateAttribute(NoteEntity.FileNameFieldName, note.FileName);
            entity.AddOrUpdateAttribute(NoteEntity.MimeTypeFieldName, note.MimeType);
            entity.AddOrUpdateAttribute(NoteEntity.RegardingObjectFieldName, note.RegardingObject);
            entity.AddOrUpdateAttribute(NoteEntity.SubjectFieldName, note.Subject);
            entity.AddOrUpdateAttribute(NoteEntity.TextFieldName, note.Text);

            entity.Id = Service.Create(entity);

            return entity;
        }
    }
}
