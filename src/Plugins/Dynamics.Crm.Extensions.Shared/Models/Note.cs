using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class Note : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return NoteEntity.TypeName;
            }
        }

        public String Subject
        {
            get; set;
        }

        public String Text
        {
            get; set;
        }

        public String FileName
        {
            get; set;
        }

        public String MimeType
        {
            get; set;
        }

        public String DocumentBody
        {
            get; set;
        }

        public EntityReference RegardingObject
        {
            get; set;
        }
    }
}
