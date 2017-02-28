using Dynamics.Crm.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class EntityReferenceFacts
    {
        [TestClass]
        public class CloneMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullReference()
            {
                var reference = default(EntityReference);

                reference.Clone(ensureNotNull: true);
            }

            [TestMethod]            
            public void ReturnsNullForNullArgument()
            {
                var reference = default(EntityReference);

                var clone = reference.Clone(ensureNotNull: false);

                Assert.IsNull(clone);
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullArgument()
            {
                var reference = default(EntityReference);

                var clone = reference.Clone(ensureNotNull: true);                
            }

            [TestMethod]
            public void ReturnsCloneForEntityReference()
            {
                var reference = default(EntityReference);
                var clone = default(EntityReference);

                reference = new EntityReference();
                clone = reference.Clone();

                Assert.IsNotNull(clone);
                Assert.AreEqual(reference.Id, clone.Id);
                Assert.AreEqual(reference.LogicalName, clone.LogicalName);

                reference = new EntityReference(Schema.AccountEntity.TypeName);
                clone = reference.Clone();

                Assert.IsNotNull(clone);
                Assert.AreEqual(reference.Id, clone.Id);
                Assert.AreEqual(reference.LogicalName, clone.LogicalName);

                reference = new EntityReference(Schema.AccountEntity.TypeName, Guid.NewGuid());
                clone = reference.Clone();

                Assert.IsNotNull(clone);
                Assert.AreEqual(reference.Id, clone.Id);
                Assert.AreEqual(reference.LogicalName, clone.LogicalName);
            }
        }
    }
}
