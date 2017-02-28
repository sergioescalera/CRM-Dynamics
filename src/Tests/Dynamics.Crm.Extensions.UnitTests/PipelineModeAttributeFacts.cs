using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class PipelineModeAttributeFacts
    {
        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullArgument()
            {
                var attribute = new PipelineModeAttribute(null);
            }

            [TestMethod]
            public void InitializesNewObjectWithValidArgument()
            {
                var attribute = default(PipelineModeAttribute);
                
                attribute = new PipelineModeAttribute();

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.SupportedModes);
                Assert.AreEqual(0, attribute.SupportedModes.Length);

                var mode = MessageProcessingStepMode.Synchronous;

                attribute = new PipelineModeAttribute(mode);

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.SupportedModes);
                Assert.AreEqual(1, attribute.SupportedModes.Length);
                CollectionAssert.AreEqual(new [] { mode }, attribute.SupportedModes);
            }
        }
    }
}
