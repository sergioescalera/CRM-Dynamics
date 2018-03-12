using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class EmailRepository : Repository
    {
        public EmailRepository(IPluginContext context)
            : this(context, context?.GetOrganizationServiceContext())
        {
        }

        public EmailRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return EmailEntity.TypeName;
            }
        }

        public virtual Entity Create(
            String subject,
            String body,
            EntityReference fromReference,
            EntityReference[] toReferences,
            EntityReference regarding)
        {
            var email = new Entity(EmailEntity.TypeName);

            var from = new Entity(ActivityPartyEntity.TypeName);

            from.AddOrUpdateAttribute(ActivityPartyEntity.PartyFieldName, fromReference);

            var fromList = new EntityCollection(new[] { from });

            var toList = new EntityCollection(toReferences
                .Select(o =>
                {
                    var party = new Entity(ActivityPartyEntity.TypeName);

                    party.AddOrUpdateAttribute(ActivityPartyEntity.PartyFieldName, o);

                    return party;
                })
                .ToList());

            email.AddOrUpdateAttribute(EmailEntity.SubjectFieldName, subject);
            email.AddOrUpdateAttribute(EmailEntity.DescriptionFieldName, body);
            email.AddOrUpdateAttribute(EmailEntity.FromFieldName, fromList);
            email.AddOrUpdateAttribute(EmailEntity.ToFieldName, toList);
            email.AddOrUpdateAttribute(EmailEntity.RegardingObjectFieldName, regarding);

            email.Id = Service.Create(email);

            return email;
        }

        public virtual SendEmailResponse Send(
            Guid emailId,
            Boolean issueSend = true,
            String trackingToken = null)
        {
            var response = Service.Execute<SendEmailResponse>(new SendEmailRequest
            {
                EmailId = emailId,
                IssueSend = issueSend,
                TrackingToken = trackingToken
            });

            return response;
        }
    }
}
