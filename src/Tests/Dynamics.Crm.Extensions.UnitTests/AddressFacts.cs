using Dynamics.Crm.Data;
using Dynamics.Crm.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public class AddressFacts
    {
        [TestClass]
        public class CopyToMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullEntity()
            {
                var address = new Address();            
                    
                address.CopyTo(entity: null, addressName: "address");
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullAddressName()
            {
                var entity = new Entity();
                var address = new Address();     
                           
                address.CopyTo(entity, addressName: null);
            }

            [TestMethod]
            public void CopiesNullAddress()
            {
                var entity = new Entity();
                var address = default(Address);
                var addressName = "address";

                address.CopyTo(entity, addressName);

                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.CityFieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.CountryFieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.Line1FieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.Line2FieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.Line3FieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.NameFieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.PhoneFieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.PostalCodeFieldFormat(addressName)));
                Assert.IsNull(entity.GetAttributeValue<String>(Schema.AddressStruct.StateFieldFormat(addressName)));
            }

            [TestMethod]
            public void CopiesEmptyAddress()
            {
                var entity = new Entity();
                var address = new Address();
                var addressName = "address";

                address.CopyTo(entity, addressName);

                Assert.AreEqual(address.City, entity.GetAttributeValue<String>(Schema.AddressStruct.CityFieldFormat(addressName)));
                Assert.AreEqual(address.Country, entity.GetAttributeValue<String>(Schema.AddressStruct.CountryFieldFormat(addressName)));
                Assert.AreEqual(address.Line1, entity.GetAttributeValue<String>(Schema.AddressStruct.Line1FieldFormat(addressName)));
                Assert.AreEqual(address.Line2, entity.GetAttributeValue<String>(Schema.AddressStruct.Line2FieldFormat(addressName)));
                Assert.AreEqual(address.Line3, entity.GetAttributeValue<String>(Schema.AddressStruct.Line3FieldFormat(addressName)));
                Assert.AreEqual(address.Name, entity.GetAttributeValue<String>(Schema.AddressStruct.NameFieldFormat(addressName)));
                Assert.AreEqual(address.Phone, entity.GetAttributeValue<String>(Schema.AddressStruct.PhoneFieldFormat(addressName)));
                Assert.AreEqual(address.PostalCode, entity.GetAttributeValue<String>(Schema.AddressStruct.PostalCodeFieldFormat(addressName)));
                Assert.AreEqual(address.State, entity.GetAttributeValue<String>(Schema.AddressStruct.StateFieldFormat(addressName)));
            }

            [TestMethod]
            public void CopiesNonEmptyAddress()
            {
                var entity = new Entity();
                var address = new Address
                {
                    City = "Some City",
                    Country = "Some Country",
                    Line1 = "123 Main Street",
                    Line2 = "Apt. 001",
                    Line3 = "",
                    Name = "Billing Address",
                    Phone = "555 1234",
                    PostalCode = "12345",
                    State = "Some State"
                };
                var addressName = "address";
                address.CopyTo(entity, addressName);

                Assert.AreEqual(address.City, entity.GetAttributeValue<String>(Schema.AddressStruct.CityFieldFormat(addressName)));
                Assert.AreEqual(address.Country, entity.GetAttributeValue<String>(Schema.AddressStruct.CountryFieldFormat(addressName)));
                Assert.AreEqual(address.Line1, entity.GetAttributeValue<String>(Schema.AddressStruct.Line1FieldFormat(addressName)));
                Assert.AreEqual(address.Line2, entity.GetAttributeValue<String>(Schema.AddressStruct.Line2FieldFormat(addressName)));
                Assert.AreEqual(address.Line3, entity.GetAttributeValue<String>(Schema.AddressStruct.Line3FieldFormat(addressName)));
                Assert.AreEqual(address.Name, entity.GetAttributeValue<String>(Schema.AddressStruct.NameFieldFormat(addressName)));
                Assert.AreEqual(address.Phone, entity.GetAttributeValue<String>(Schema.AddressStruct.PhoneFieldFormat(addressName)));
                Assert.AreEqual(address.PostalCode, entity.GetAttributeValue<String>(Schema.AddressStruct.PostalCodeFieldFormat(addressName)));
                Assert.AreEqual(address.State, entity.GetAttributeValue<String>(Schema.AddressStruct.StateFieldFormat(addressName)));
            }
        }

        [TestClass]
        public class CopyFromMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullEntity()
            {
                var entity = default(Entity);

                entity.GetAddress(addressName: "address");
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullAddressName()
            {
                var entity = new Entity();

                entity.GetAddress(addressName: null);
            }

            [TestMethod]            
            public void ReturnsEmptyAddress()
            {
                var entity = new Entity();
                var addressName = "address";

                var address = entity.GetAddress(addressName);

                Assert.AreEqual(address.City, entity.GetAttributeValue<String>(Schema.AddressStruct.CityFieldFormat(addressName)));
                Assert.AreEqual(address.Country, entity.GetAttributeValue<String>(Schema.AddressStruct.CountryFieldFormat(addressName)));
                Assert.AreEqual(address.Line1, entity.GetAttributeValue<String>(Schema.AddressStruct.Line1FieldFormat(addressName)));
                Assert.AreEqual(address.Line2, entity.GetAttributeValue<String>(Schema.AddressStruct.Line2FieldFormat(addressName)));
                Assert.AreEqual(address.Line3, entity.GetAttributeValue<String>(Schema.AddressStruct.Line3FieldFormat(addressName)));
                Assert.AreEqual(address.Name, entity.GetAttributeValue<String>(Schema.AddressStruct.NameFieldFormat(addressName)));
                Assert.AreEqual(address.Phone, entity.GetAttributeValue<String>(Schema.AddressStruct.PhoneFieldFormat(addressName)));
                Assert.AreEqual(address.PostalCode, entity.GetAttributeValue<String>(Schema.AddressStruct.PostalCodeFieldFormat(addressName)));
                Assert.AreEqual(address.State, entity.GetAttributeValue<String>(Schema.AddressStruct.StateFieldFormat(addressName)));
            }

            [TestMethod]
            public void ReturnsNonEmptyAddress()
            {
                var entity = new Entity();
                var addressName = "address";

                entity.AddOrUpdateAttribute(Schema.AddressStruct.CityFieldFormat(addressName), "The city");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.CountryFieldFormat(addressName), "The country");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.Line1FieldFormat(addressName), "111 Some Street");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.Line2FieldFormat(addressName), "Unit 444");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.Line3FieldFormat(addressName), "");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.NameFieldFormat(addressName), "The name");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.PhoneFieldFormat(addressName), "555 0987");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.PostalCodeFieldFormat(addressName), "12345");
                entity.AddOrUpdateAttribute(Schema.AddressStruct.StateFieldFormat(addressName), "My state");

                var address = entity.GetAddress(addressName);

                Assert.AreEqual(address.City, entity.GetAttributeValue<String>(Schema.AddressStruct.CityFieldFormat(addressName)));
                Assert.AreEqual(address.Country, entity.GetAttributeValue<String>(Schema.AddressStruct.CountryFieldFormat(addressName)));
                Assert.AreEqual(address.Line1, entity.GetAttributeValue<String>(Schema.AddressStruct.Line1FieldFormat(addressName)));
                Assert.AreEqual(address.Line2, entity.GetAttributeValue<String>(Schema.AddressStruct.Line2FieldFormat(addressName)));
                Assert.AreEqual(address.Line3, entity.GetAttributeValue<String>(Schema.AddressStruct.Line3FieldFormat(addressName)));
                Assert.AreEqual(address.Name, entity.GetAttributeValue<String>(Schema.AddressStruct.NameFieldFormat(addressName)));
                Assert.AreEqual(address.Phone, entity.GetAttributeValue<String>(Schema.AddressStruct.PhoneFieldFormat(addressName)));
                Assert.AreEqual(address.PostalCode, entity.GetAttributeValue<String>(Schema.AddressStruct.PostalCodeFieldFormat(addressName)));
                Assert.AreEqual(address.State, entity.GetAttributeValue<String>(Schema.AddressStruct.StateFieldFormat(addressName)));
            }
        }
    }
}
