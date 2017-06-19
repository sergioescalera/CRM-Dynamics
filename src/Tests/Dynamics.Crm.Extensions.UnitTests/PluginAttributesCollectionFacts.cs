using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SamplePluginLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class PluginAttributesCollectionFacts
    {
        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullType()
            {
                var attributes = new PluginAttributesCollection(null);
            }

            [TestMethod]
            public void InitializesCollectionWithValidType()
            {
                var type = typeof(SampleAccountPlugin);
                var attributes = new PluginAttributesCollection(type);

                Assert.IsNotNull(attributes);
                Assert.AreEqual(4, attributes.Count());
                Assert.AreEqual(Schema.AccountEntity.TypeName, attributes.PrimaryEntityLogicalName);
                CollectionAssert.AreEqual(new[] { Messages.Create }, attributes.PipelineMessages.ToArray());
                CollectionAssert.AreEqual(new[] { PipelineStage.PreOperation }, attributes.PipelineStages.ToArray());
                CollectionAssert.AreEqual(new[] { ExecutionMode.Synchronous }, attributes.ExecutionModes.ToArray());
            }
        }
    }
}
