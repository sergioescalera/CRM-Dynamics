using Dynamics.Crm.Attributes;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class PipelineMessageAttributeFacts
    {
        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullArgument()
            {
                var attribute = new PipelineMessageAttribute(null);
            }

            [TestMethod]
            public void InitializesNewObjectWithValidArgument()
            {
                var attribute = default(PipelineMessageAttribute);
                
                attribute = new PipelineMessageAttribute();

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.Messages);
                Assert.AreEqual(0, attribute.Messages.Length);

                var message = "message";

                attribute = new PipelineMessageAttribute(message);

                Assert.IsNotNull(attribute);
                Assert.IsNotNull(attribute.Messages);
                Assert.AreEqual(1, attribute.Messages.Length);
                CollectionAssert.AreEqual(new [] { message }, attribute.Messages);
            }
        }
    }
}
