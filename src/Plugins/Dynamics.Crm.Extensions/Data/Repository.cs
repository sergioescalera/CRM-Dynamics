using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace Dynamics.Crm.Data
{
    public abstract class Repository : IRepository
    {
        private EntityMetadata _metadata;

        protected IPluginContext Local
        {
            get;
            private set;
        }

        protected OrganizationServiceContext Context
        {
            get;
            private set;
        }

        protected IOrganizationService Service
        {
            get;
            private set;
        }

        protected abstract string EntityName
        {
            get;
        }
        
        public Repository(IPluginContext local, OrganizationServiceContext context)
        {
            if (local == null)
                throw new ArgumentNullException(nameof(local));

            if (context == null)
                throw new ArgumentNullException(nameof(context));

            Local = local;
            Service = local.OrganizationService;
            Context = context;
        }

        public virtual void Create(Entity entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            if (Context.IsAttached(entity) || Context.IsDeleted(entity))
                throw new InvalidOperationException();

            Context.AddObject(entity);
        }

        public virtual void Delete(Guid entityId)
        {
            if (entityId == Guid.Empty)
                throw new ArgumentException();

            Delete(new Entity(EntityName)
            {
                Id = entityId
            });
        }

        public virtual void Delete(Entity entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            Attach(entity);

            Context.DeleteObject(entity);
        }

        public virtual void Update(Entity entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            Attach(entity);

            Context.UpdateObject(entity);
        }

        public virtual Entity GetEntityById(Guid recordId)
        {
            var primaryIdAttribute = GetPrimaryIdAttribute();

            var query = from e in Context.CreateQuery(this.EntityName)
                        where e.GetAttributeValue<Guid>(primaryIdAttribute) == recordId
                        select e;

            var result = query.ToList().FirstOrDefault();

            return result;
        }

        protected virtual void Attach(Entity entity)
        {
            if (Context.IsAttached(entity))
                return;

            var attached = Context
                .GetAttachedEntities()
                .FirstOrDefault(e => e.Id == entity.Id && e != entity);

            if (attached != null)
                Context.Detach(attached);

            Context.Attach(entity);
        }

        protected virtual String GetPrimaryIdAttribute()
        {
            var metadata = GetEntityMetadata();

            return metadata.PrimaryIdAttribute;
        }

        protected virtual EntityMetadata GetEntityMetadata()
        {
            if (_metadata != null)
                return _metadata;

            var req = new RetrieveEntityRequest
            {
                EntityFilters = EntityFilters.Entity,
                LogicalName = EntityName,
            };
            
            var response = (RetrieveEntityResponse)Context.Execute(req);

            return _metadata = response.EntityMetadata;
        }
    }
}
