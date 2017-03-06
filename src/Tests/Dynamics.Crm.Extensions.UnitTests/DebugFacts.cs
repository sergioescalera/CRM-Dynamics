using Dynamics.Crm.Diagnostics;
using Dynamics.Crm.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Moq;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class DebugFacts
    {
        [TestClass]
        public class AssertMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                Debug.Assert(condition: true, message: "Hello world!", localContext: null);
            }

            [TestMethod]            
            public void DoesNotLogMessageWhenConditionIsTrue()
            {
                var context = new Mock<IPluginContext>();
                var trace = new Mock<ITracingService>();
                var message = "Hello world!";

                context.Setup(o => o.TracingService).Returns(trace.Object);
                trace.Setup(o => o.Trace(message)).Verifiable();

                Debug.Assert(condition: true, message: message, localContext: context.Object);

                trace.Verify(o => o.Trace(message), Times.Never);
            }

            [TestMethod]
            public void LogsMessageWhenConditionIsFalse()
            {
                var context = new Mock<IPluginContext>();
                var trace = new Mock<ITracingService>();
                var message = "Hello world!";

                context.Setup(o => o.TracingService).Returns(trace.Object);
                trace.Setup(o => o.Trace(message)).Verifiable();

                Debug.Assert(condition: false, message: message, localContext: context.Object);

                trace.Verify(o => o.Trace(message), Times.Once);
            }
        }
    }
}
