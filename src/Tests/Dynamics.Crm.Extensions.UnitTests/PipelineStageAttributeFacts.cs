using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class PipelineStageAttributeFacts
    {
        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullArgument()
            {
                var attribute = new PipelineStageAttribute(null);
            }

            [TestMethod]
            public void InitializesNewObjectWithValidArgument()
            {
                var attribute = default(PipelineStageAttribute);
                
                attribute = new PipelineStageAttribute();

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.SupportedStages);
                Assert.AreEqual(0, attribute.SupportedStages.Length);

                var stage = PipelineStage.PostOperation;

                attribute = new PipelineStageAttribute(stage);

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.SupportedStages);
                Assert.AreEqual(1, attribute.SupportedStages.Length);
                CollectionAssert.AreEqual(new [] { stage }, attribute.SupportedStages);
            }
        }
    }
}