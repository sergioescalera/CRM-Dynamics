using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Data
{
    public class ProductRepository : Repository
    {
        public ProductRepository(IPluginContext pluginContext)
            : base(pluginContext, pluginContext?.GetOrganizationServiceContext())
        {
        }

        public ProductRepository(IPluginContext pluginContext, OrganizationServiceContext context)
            : base(pluginContext, context)
        {
        }

        protected override String EntityName
        {
            get
            {
                return ProductEntity.TypeName;
            }
        }

        public virtual Product GetById(Guid productId)
        {
            this.EnsureNotEmpty(productId);

            var entity = Service.Retrieve(
                EntityName,
                productId,
                ProductEntity.NumberFieldName,
                ProductEntity.UnitGroupFieldName,
                ProductEntity.DefaultUnitFieldName,
                Common.NameFieldName);
            
            return entity == null ? null : new Product
            {
                Id = entity.Id,
                Name = entity.GetAttributeValue<String>(Common.NameFieldName),
                Number = entity.GetAttributeValue<String>(ProductEntity.NumberFieldName),
                UnitGroup = entity.GetAttributeValue<EntityReference>(ProductEntity.UnitGroupFieldName),
                DefaultUnit = entity.GetAttributeValue<EntityReference>(ProductEntity.DefaultUnitFieldName)
            };
        }
    }
}
