using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.SharePoint
{
    public class DocumentLocationRepository : Repository
    {
        public DocumentLocationRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {

        }

        public DocumentLocationRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return SPDocumentLocationEntity.TypeName;
            }
        }

        public virtual IEnumerable<DocumentLocation> GetByRegardingObjectId(Guid regardingObjectId)
        {
            this.EnsureNotEmpty(regardingObjectId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(SPDocumentLocationEntity.RegardingObjectFieldName).Id == regardingObjectId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(SPDocumentLocationEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            AbsoluteUrl = o.GetAttributeValue<String>(SPDocumentLocationEntity.AbsoluteUrlFieldName),
                            RelativeUrl = o.GetAttributeValue<String>(SPDocumentLocationEntity.RelativeUrlFieldName),
                            ParentSiteOrLocation = o.GetAttributeValue<EntityReference>(SPDocumentLocationEntity.ParentSiteOrLocationFieldName),
                            RegardingObject = o.GetAttributeValue<EntityReference>(SPDocumentLocationEntity.RegardingObjectFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new DocumentLocation
                {
                    AbsoluteUrl = o.AbsoluteUrl,
                    Id = o.Id,
                    Name = o.Name,
                    ParentSiteOrLocation = o.ParentSiteOrLocation,
                    RegardingObject = o.RegardingObject,
                    RelativeUrl = o.RelativeUrl
                }).ToArray();
        }

        public virtual IEnumerable<DocumentLocation> GetByParentSiteOrLocationId(Guid parentSiteOrLocationId)
        {
            this.EnsureNotEmpty(parentSiteOrLocationId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(SPDocumentLocationEntity.ParentSiteOrLocationFieldName).Id == parentSiteOrLocationId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(SPDocumentLocationEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            AbsoluteUrl = o.GetAttributeValue<String>(SPDocumentLocationEntity.AbsoluteUrlFieldName),
                            RelativeUrl = o.GetAttributeValue<String>(SPDocumentLocationEntity.RelativeUrlFieldName),
                            ParentSiteOrLocation = o.GetAttributeValue<EntityReference>(SPDocumentLocationEntity.ParentSiteOrLocationFieldName),
                            RegardingObject = o.GetAttributeValue<EntityReference>(SPDocumentLocationEntity.RegardingObjectFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new DocumentLocation
                {
                    AbsoluteUrl = o.AbsoluteUrl,
                    Id = o.Id,
                    Name = o.Name,
                    ParentSiteOrLocation = o.ParentSiteOrLocation,
                    RegardingObject = o.RegardingObject,
                    RelativeUrl = o.RelativeUrl
                }).ToArray();
        }
    }
}
