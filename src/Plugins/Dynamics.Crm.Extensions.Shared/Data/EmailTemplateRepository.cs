using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class EmailTemplateRepository : Repository
    {
        public EmailTemplateRepository(IPluginContext context)
            : this(context, context?.GetOrganizationServiceContext())
        {
        }

        public EmailTemplateRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return EmailTemplateEntity.TypeName;
            }
        }

        public virtual EmailTemplate GetById(Guid templateId)
        {
            this.EnsureNotEmpty(templateId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<Guid>(EmailTemplateEntity.IdFieldName) == templateId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(EmailTemplateEntity.IdFieldName),
                            Body = o.GetAttributeValue<String>(EmailTemplateEntity.BodyFieldName),
                            Description = o.GetAttributeValue<String>(EmailTemplateEntity.DescriptionFieldName),
                            Subject = o.GetAttributeValue<String>(EmailTemplateEntity.SubjectFieldName),
                            Title = o.GetAttributeValue<String>(EmailTemplateEntity.TitleFieldName)
                        };

            var array = query.ToArray();

            return array.Empty() ? null : new EmailTemplate
            {
                Body = array[0].Body,
                Description = array[0].Description,
                Id = array[0].Id,
                Subject = array[0].Subject,
                Title = array[0].Title
            };
        }
    }
}
