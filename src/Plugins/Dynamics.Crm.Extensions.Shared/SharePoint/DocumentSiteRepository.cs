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
    public class DocumentSiteRepository : Repository
    {
        public DocumentSiteRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {

        }

        public DocumentSiteRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return SPDocumentSiteEntity.TypeName;
            }
        }

        public virtual IEnumerable<DocumentSite> GetAll()
        {
            var query = from o in Context.CreateQuery(EntityName)
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(SPDocumentSiteEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            AbsoluteUrl = o.GetAttributeValue<String>(SPDocumentSiteEntity.AbsoluteUrlFieldName),
                            IsDefault = o.GetAttributeValue<Boolean>(SPDocumentSiteEntity.IsDefaultFieldName),
                            RelativeUrl = o.GetAttributeValue<String>(SPDocumentSiteEntity.RelativeUrlFieldName),
                            ParentSite = o.GetAttributeValue<EntityReference>(SPDocumentSiteEntity.ParentSiteFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new DocumentSite
                {
                    AbsoluteUrl = o.AbsoluteUrl,
                    Id = o.Id,
                    IsDefault = o.IsDefault,
                    Name = o.Name,
                    ParentSite = o.ParentSite,
                    RelativeUrl = o.RelativeUrl
                }).ToArray();
        }

        public virtual IEnumerable<DocumentSite> GetByParentSiteId(Guid parentSiteId)
        {
            this.EnsureNotEmpty(parentSiteId);

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<EntityReference>(SPDocumentSiteEntity.ParentSiteFieldName).Id == parentSiteId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(SPDocumentSiteEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            AbsoluteUrl = o.GetAttributeValue<String>(SPDocumentSiteEntity.AbsoluteUrlFieldName),
                            IsDefault = o.GetAttributeValue<Boolean>(SPDocumentSiteEntity.IsDefaultFieldName),
                            RelativeUrl = o.GetAttributeValue<String>(SPDocumentSiteEntity.RelativeUrlFieldName),
                            ParentSite = o.GetAttributeValue<EntityReference>(SPDocumentSiteEntity.ParentSiteFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new DocumentSite
                {
                    AbsoluteUrl = o.AbsoluteUrl,
                    Id = o.Id,
                    IsDefault = o.IsDefault,
                    Name = o.Name,
                    ParentSite = o.ParentSite,
                    RelativeUrl = o.RelativeUrl
                }).ToArray();
        }

        public virtual IEnumerable<DocumentSite> GetDefault()
        {
            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<Boolean>(SPDocumentSiteEntity.IsDefaultFieldName) == true
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(SPDocumentSiteEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            AbsoluteUrl = o.GetAttributeValue<String>(SPDocumentSiteEntity.AbsoluteUrlFieldName),
                            IsDefault = o.GetAttributeValue<Boolean>(SPDocumentSiteEntity.IsDefaultFieldName),
                            RelativeUrl = o.GetAttributeValue<String>(SPDocumentSiteEntity.RelativeUrlFieldName),
                            ParentSite = o.GetAttributeValue<EntityReference>(SPDocumentSiteEntity.ParentSiteFieldName)
                        };

            var array = query.ToArray();

            return array
                .Select(o => new DocumentSite
                {
                    AbsoluteUrl = o.AbsoluteUrl,
                    Id = o.Id,
                    IsDefault = o.IsDefault,
                    Name = o.Name,
                    ParentSite = o.ParentSite,
                    RelativeUrl = o.RelativeUrl
                }).ToArray();
        }
    }
}
