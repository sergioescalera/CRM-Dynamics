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

            var query = from o in Context.CreateQuery(EntityName)
                        where o.GetAttributeValue<Guid>(ProductEntity.IdFieldName) == productId
                        select new
                        {
                            Id = o.GetAttributeValue<Guid>(ProductEntity.IdFieldName),
                            Name = o.GetAttributeValue<String>(Common.NameFieldName),
                            Number = o.GetAttributeValue<String>(ProductEntity.NumberFieldName),
                            UnitGroup = o.GetAttributeValue<EntityReference>(ProductEntity.UnitGroupFieldName),
                            DefaultUnit = o.GetAttributeValue<EntityReference>(ProductEntity.DefaultUnitFieldName)
                        };

            var array = query.ToArray();

            var item = array.FirstOrDefault();

            return item == null ? null : new Product
            {
                Id = item.Id,
                Name = item.Name,
                Number = item.Number,
                UnitGroup = item.UnitGroup,
                DefaultUnit = item.DefaultUnit
            };
        }
    }
}
