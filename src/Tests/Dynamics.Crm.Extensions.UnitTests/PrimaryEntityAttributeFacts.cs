using Dynamics.Crm.Attributes;
using Dynamics.Crm.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class PrimaryEntityAttributeFacts
    {
        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullArgument()
            {
                var attribute = new PrimaryEntityAttribute(null);
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentException))]
            public void ThrowsErrorForEmptyArgument()
            {
                var attribute = new PrimaryEntityAttribute(String.Empty);
            }

            [TestMethod]
            public void InitializesNewObjectWithValidArgument()
            {
                var attribute = new PrimaryEntityAttribute(Schema.AccountEntity.TypeName);

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.EntityLogicalName);
                Assert.AreEqual(Schema.AccountEntity.TypeName, attribute.EntityLogicalName);                
            }
        }
    }
}
