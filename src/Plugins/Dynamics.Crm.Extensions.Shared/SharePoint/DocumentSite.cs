using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.SharePoint
{
    public class DocumentSite : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return SPDocumentSiteEntity.TypeName;
            }
        }

        public String Name
        {
            get; set;
        }

        public String AbsoluteUrl
        {
            get; set;
        }

        public Boolean IsDefault
        {
            get; set;
        }

        public EntityReference ParentSite
        {
            get; set;
        }
        
        public String RelativeUrl
        {
            get; set;
        }
    }
}
