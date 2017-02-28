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
                /*
                 * 
                 * [PrimaryEntity(Schema.AccountEntity.TypeName)]
                 * [PipelineMessage(Messages.Create)]
                 * [PipelineStage(PipelineStage.PreOperation)]
                 * [PipelineMode(MessageProcessingStepMode.Synchronous)]
                 * public class SampleAccountPlugin ...
                 * 
                 */

                var type = typeof(SampleAccountPlugin);
                var attributes = new PluginAttributesCollection(type);

                Assert.IsNotNull(attributes);
                Assert.IsNotNull(attributes.Attributes);
                Assert.AreEqual(4, attributes.Attributes.Count());
                Assert.AreEqual(Schema.AccountEntity.TypeName, attributes.PrimaryEntityLogicalName);
                CollectionAssert.AreEqual(new[] { Messages.Create }, attributes.PipelineMessages.ToArray());
                CollectionAssert.AreEqual(new[] { PipelineStage.PreOperation }, attributes.PipelineStages.ToArray());
                CollectionAssert.AreEqual(new[] { MessageProcessingStepMode.Synchronous }, attributes.MessageProcessingStepModes.ToArray());
            }
        }
    }
}
