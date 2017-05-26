using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.SharePoint
{
    public class DocumentLocation : IEntity
    {
        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return SPDocumentLocationEntity.TypeName;
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

        public EntityReference ParentSiteOrLocation
        {
            get; set;
        }

        public EntityReference RegardingObject
        {
            get; set;
        }

        public String RelativeUrl
        {
            get; set;
        }
    }
}
