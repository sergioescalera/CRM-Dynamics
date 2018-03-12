using Dynamics.Crm.Interfaces;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public class EmailTemplate : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return EmailTemplateEntity.TypeName;
            }
        }

        public String Body
        {
            get; set;
        }

        public String Subject
        {
            get; set;
        }

        public String Title
        {
            get; set;
        }

        public String Description
        {
            get; set;
        }
    }
}
