using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public class EntityFacts
    {
        [TestClass]
        public class GetAttributeValueMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullEntity()
            {
                var entity = default(Entity);
                
                entity.GetAttributeValue<Object>(attributeLogicalName: "anyAtt", image: new Entity());
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullAttributeName()
            {
                var entity = new Entity();
                
                entity.GetAttributeValue<Object>(attributeLogicalName: null, image: new Entity());
            }

            [TestMethod]            
            public void ReturnsValueForNullImage()
            {
                var entity = new Entity();
                var key = "SomeAttribute";
                var value = "Some Value";
                var @default = "Default Value";

                entity.Attributes.Add(key, value);

                Assert.AreEqual(entity.GetAttributeValue<String>(key, image: null), value);
                Assert.AreEqual(entity.GetAttributeValue<String>("OtherAttribute", image: null, defaultValue: @default), @default);
            }

            [TestMethod]
            public void ReturnsValueForNotNullImage()
            {
                var entity = new Entity();
                var image = new Entity();
                var key1 = "SomeAttribute";
                var value1 = "Some Value";
                var key2 = "SomeOtherAttribute";
                var value2 = "Some other value";
                var @default = "Default Value";

                entity.Attributes.Add(key1, value1);
                image.Attributes.Add(key2, value2);

                Assert.AreEqual(entity.GetAttributeValue<String>(key1, image), value1);
                Assert.AreEqual(entity.GetAttributeValue<String>(key2, image), value2);
                Assert.AreEqual(entity.GetAttributeValue<String>("OtherAttribute", image, defaultValue: @default), @default);
            }
        }

        [TestClass]
        public class AddOrUpdateAttributeMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullEntity()
            {
                var entity = default(Entity);

                entity.AddOrUpdateAttribute(attributeLogicalName: "SomeAttribute", value: "some value");
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullAttributeName()
            {
                var entity = new Entity();

                entity.AddOrUpdateAttribute(attributeLogicalName: null, value: "some value");
            }

            [TestMethod]
            public void AddsOrUpdatesValueForValidArguments()
            {
                var entity = new Entity();
                var key = "SomeAtttribute";
                var value1 = "Some value";
                var value2 = "Some other value";

                entity.AddOrUpdateAttribute(attributeLogicalName: key, value: value1);

                Assert.AreEqual(1, entity.Attributes.Count);
                Assert.AreEqual(value1, entity.Attributes[key]);

                entity.AddOrUpdateAttribute(attributeLogicalName: key, value: value2);

                Assert.AreEqual(value2, entity.Attributes[key]);
            }
        }
    }
}
