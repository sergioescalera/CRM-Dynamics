using Dynamics.Crm.Extensions;
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

            var entity = Service.Retrieve(
                EntityName,
                templateId,
                EmailTemplateEntity.IdFieldName,
                EmailTemplateEntity.BodyFieldName,
                EmailTemplateEntity.DescriptionFieldName,
                EmailTemplateEntity.SubjectFieldName,
                EmailTemplateEntity.TitleFieldName);
            
            return entity == null ? null : new EmailTemplate
            {
                Id = entity.Id,
                Body = entity.GetAttributeValue<String>(EmailTemplateEntity.BodyFieldName),
                Description = entity.GetAttributeValue<String>(EmailTemplateEntity.DescriptionFieldName),
                Subject = entity.GetAttributeValue<String>(EmailTemplateEntity.SubjectFieldName),
                Title = entity.GetAttributeValue<String>(EmailTemplateEntity.TitleFieldName)
            };
        }
    }
}
