using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions
{
    public static class AddressExtensions
    {
        public static void CopyTo(this IAddress address, Entity entity, String addressName)
        {
            ValidationHelper.EnsureNotNull(entity, nameof(entity));
            ValidationHelper.EnsureNotNull(addressName, nameof(addressName));
            
            if (address == null)
                return;

            entity.AddOrUpdateAttribute(Schema.AddressStruct.NameFieldFormat(addressName), address.Name);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.CityFieldFormat(addressName), address.City);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.CountryFieldFormat(addressName), address.Country);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.Line1FieldFormat(addressName), address.Line1);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.Line2FieldFormat(addressName), address.Line2);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.Line3FieldFormat(addressName), address.Line3);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.PostalCodeFieldFormat(addressName), address.PostalCode);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.StateFieldFormat(addressName), address.State);
            entity.AddOrUpdateAttribute(Schema.AddressStruct.PhoneFieldFormat(addressName), address.Phone);
        }
    }
}
