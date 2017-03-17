using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions
{
    public static class EntityExtensions
    {
        #region Attributes
        
        public static T GetAttributeValue<T>(this Entity entity, String attributeLogicalName, Entity image, T defaultValue = default(T))
        {
            ValidationHelper.EnsureNotNull(entity, nameof(entity));
            ValidationHelper.EnsureNotNull(attributeLogicalName, nameof(attributeLogicalName));
            
            return entity
                .Contains(attributeLogicalName)
                ? entity.GetAttributeValue<T>(attributeLogicalName)
                : image != null && image.Contains(attributeLogicalName)
                ? image.GetAttributeValue<T>(attributeLogicalName)
                : defaultValue;
        }
        
        public static void AddOrUpdateAttribute(this Entity entity, String attributeLogicalName, Object value)
        {
            ValidationHelper.EnsureNotNull(entity, nameof(entity));
            ValidationHelper.EnsureNotNull(attributeLogicalName, nameof(attributeLogicalName));

            if (entity.Attributes.Contains(attributeLogicalName))
                entity.Attributes[attributeLogicalName] = value;
            else
                entity.Attributes.Add(attributeLogicalName, value);
        }
        
        #endregion

        #region Address Support

        public static IAddress GetAddress(this Entity entity, String addressName)
        {
            ValidationHelper.EnsureNotNull(entity, nameof(entity));
            ValidationHelper.EnsureNotNull(addressName, nameof(addressName));
            
            return new Address
            {
                Name = entity.GetAttributeValue<String>(Schema.AddressStruct.NameFieldFormat(addressName)),
                City = entity.GetAttributeValue<String>(Schema.AddressStruct.CityFieldFormat(addressName)),
                Country = entity.GetAttributeValue<String>(Schema.AddressStruct.CountryFieldFormat(addressName)),
                Line1 = entity.GetAttributeValue<String>(Schema.AddressStruct.Line1FieldFormat(addressName)),
                Line2 = entity.GetAttributeValue<String>(Schema.AddressStruct.Line2FieldFormat(addressName)),
                Line3 = entity.GetAttributeValue<String>(Schema.AddressStruct.Line3FieldFormat(addressName)),
                PostalCode = entity.GetAttributeValue<String>(Schema.AddressStruct.PostalCodeFieldFormat(addressName)),
                State = entity.GetAttributeValue<String>(Schema.AddressStruct.StateFieldFormat(addressName)),
                Phone = entity.GetAttributeValue<String>(Schema.AddressStruct.PhoneFieldFormat(addressName))
            };
        }

        #endregion

        #region IEntity

        public static EntityReference ToEntityReference(this IEntity entity)
        {
            ValidationHelper.EnsureNotNull(entity);

            return new EntityReference(entity.TypeName, entity.Id);
        }

        #endregion
    }
}
