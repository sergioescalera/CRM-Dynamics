using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Extensions
{
    public static class OrganizationServiceExtensions
    {
        public static TResponse Execute<TResponse>(this IOrganizationService service, OrganizationRequest request)
            where TResponse : OrganizationResponse
        {
            ValidationHelper.EnsureNotNull(service, nameof(service));
            ValidationHelper.EnsureNotNull(request, nameof(request));
            
            var response = service.Execute(request);

            return (TResponse)response;
        }

        public static EntityCollection Fetch(this IOrganizationService service, String fetch)
        {
            ValidationHelper.EnsureNotNull(service, nameof(service));
            ValidationHelper.EnsureNotNull(fetch, nameof(fetch));

            var request = new RetrieveMultipleRequest
            {
                Query = new FetchExpression(fetch)
            };

            var response = service.Execute<RetrieveMultipleResponse>(request);

            return response.EntityCollection;
        }
        
        public static IEnumerable<Entity> FetchAll(this IOrganizationService service, String fetch)
        {
            ValidationHelper.EnsureNotNull(service, nameof(service));
            ValidationHelper.EnsureNotNull(fetch, nameof(fetch));

            var list = new List<Entity>();
            var xml = new XmlDocument();

            xml.LoadXml(fetch);

            var node = xml.SelectSingleNode("/fetch");

            var pageAttribute = node.Attributes["page"];

            if (pageAttribute == null)
            {
                pageAttribute = xml.CreateAttribute("page");

                node.Attributes.Append(pageAttribute);
            }

            var page = 0;
            var colletion = default(EntityCollection);

            do
            {
                page++;

                pageAttribute.Value = page.ToString();

                colletion = service.Fetch(xml.InnerXml);

                if (colletion.Entities.Any())
                    list.AddRange(colletion.Entities);

            } while (colletion.MoreRecords);

            return list;
        }

        public static IEnumerable<Entity> RetrieveAll(this IOrganizationService service, QueryExpression query)
        {
            ValidationHelper.EnsureNotNull(service, nameof(service));
            ValidationHelper.EnsureNotNull(query, nameof(query));

            var list = new List<Entity>();

            while (true)
            {
                var pageResponse = service.RetrieveMultiple(query);

                if (pageResponse.Entities.Count > 0)
                    list.AddRange(pageResponse.Entities);

                if (!pageResponse.MoreRecords) break;

                query.PageInfo.PageNumber++;
            }

            return list;
        }

        public static SetStateResponse SetStatus(
            this IOrganizationService service, IEntity entity, StateCode state, StatusCode status)
        {
            return service.SetStatus(entity, (Int32)state, (Int32)status);
        }

        public static SetStateResponse SetStatus(
            this IOrganizationService service, IEntity entity, Int32 state, Int32 status)
        {
            ValidationHelper.EnsureNotNull(service);
            ValidationHelper.EnsureNotNull(entity);

            var request = new SetStateRequest
            {
                EntityMoniker = entity.ToEntityReference(),
                State = new OptionSetValue(state),
                Status = new OptionSetValue(status)
            };

            var response = service.Execute<SetStateResponse>(request);

            return response;
        }

        public static SetStateResponse SetStatus(
            this IOrganizationService service, EntityReference entity, StateCode state, StatusCode status)
        {
            return service.SetStatus(entity, (Int32)state, (Int32)status);
        }

        public static SetStateResponse SetStatus(
            this IOrganizationService service, EntityReference entity, Int32 state, Int32 status)
        {
            ValidationHelper.EnsureNotNull(service);
            ValidationHelper.EnsureNotNull(entity);

            var request = new SetStateRequest
            {
                EntityMoniker = entity.Clone(),
                State = new OptionSetValue(state),
                Status = new OptionSetValue(status)
            };

            var response = service.Execute<SetStateResponse>(request);

            return response;
        }

        public static SetStateResponse SetStatus(
            this IOrganizationService service, Entity entity, StateCode state, StatusCode status)
        {
            return service.SetStatus(entity?.ToEntityReference(), (Int32)state, (Int32)status);
        }

        public static SetStateResponse SetStatus(
            this IOrganizationService service, Entity entity, Int32 state, Int32 status)
        {
            return service.SetStatus(entity?.ToEntityReference(), (Int32)state, (Int32)status);
        }

        public static WinOpportunityResponse WinOpportunity(
            this IOrganizationService service,
            EntityReference opportunity, 
            DateTime? actualEnd = null, 
            Decimal? actualRevenue = null)
        {
            var opportunityClose = new Entity(OpportunityCloseMessage.Name);

            opportunityClose.AddOrUpdateAttribute(OpportunityCloseMessage.OpportunityFieldName, opportunity);
            opportunityClose.AddOrUpdateAttribute(OpportunityCloseMessage.ActualEndFieldName, actualEnd ?? DateTime.Now);

            if (actualRevenue != null)
                opportunityClose.AddOrUpdateAttribute(OpportunityCloseMessage.ActualRevenueFieldName, new Money(actualRevenue.Value));

            var request = new WinOpportunityRequest
            {
                OpportunityClose = opportunityClose,
                Status = OpportunityStatusCode.Won.ToOptionSetValue()
            };

            var response = service.Execute<WinOpportunityResponse>(request);

            return response;
        }

        public static GrantAccessResponse GrantAccess(
            this IOrganizationService service,
            EntityReference principal,
            EntityReference target,
            AccessRights accessMask)
        {
            var request = new GrantAccessRequest
            {
                PrincipalAccess = new PrincipalAccess
                {
                    AccessMask = accessMask,
                    Principal = principal
                },
                Target = target
            };

            var response = service.Execute<GrantAccessResponse>(request);

            return response;
        }

        public static Entity Retrieve(
            this IOrganizationService service,
            String entityName,
            Guid id,
            params String[] columns)
        {
            return service.Retrieve(entityName, id, new ColumnSet(columns));
        }

        public static String GetOptionSetValueLabel(
            this IOrganizationService service,
            String entityLogicalName,
            String attributeName,
            Int32 optionSetValue)
        {
            ValidationHelper.EnsureNotNull(service);
            ValidationHelper.EnsureNotNull(entityLogicalName);
            ValidationHelper.EnsureNotNull(attributeName);

            var request = new RetrieveAttributeRequest
            {
                EntityLogicalName = entityLogicalName,
                LogicalName = attributeName,
                RetrieveAsIfPublished = true
            };

            var response = service.Execute<RetrieveAttributeResponse>(request);
            var metadata = (EnumAttributeMetadata)response.AttributeMetadata;

            return metadata
                .OptionSet.Options
                .Where(x => x.Value == optionSetValue)
                .FirstOrDefault()?
                .Label.UserLocalizedLabel.Label;
        }
    }
}
