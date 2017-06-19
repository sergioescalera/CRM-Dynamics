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
                var attribute = new PipelineExecutionModeAttribute(null);
            }

            [TestMethod]
            public void InitializesNewObjectWithValidArgument()
            {
                var attribute = default(PipelineExecutionModeAttribute);
                
                attribute = new PipelineExecutionModeAttribute();

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.ExecutionModes);
                Assert.AreEqual(0, attribute.ExecutionModes.Length);

                var mode = ExecutionMode.Synchronous;

                attribute = new PipelineExecutionModeAttribute(mode);

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.ExecutionModes);
                Assert.AreEqual(1, attribute.ExecutionModes.Length);
                CollectionAssert.AreEqual(new [] { mode }, attribute.ExecutionModes);
            }
        }
    }
}
