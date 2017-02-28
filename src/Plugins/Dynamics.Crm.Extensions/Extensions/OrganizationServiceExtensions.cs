﻿using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml;

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
    }
}
