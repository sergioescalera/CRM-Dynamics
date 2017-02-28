using Dynamics.Crm.Diagnostics;
using Dynamics.Crm.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
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
                var mock = new Mock<IPluginContext>();
                var message = "Hello world!";
                
                Debug.Assert(condition: true, message: message, localContext: mock.Object);
                
                mock.Verify(m => m.Trace(message), Times.Never);
            }

            [TestMethod]
            public void LogsMessageWhenConditionIsFalse()
            {
                var mock = new Mock<IPluginContext>();
                var message = "Hello world!";

                Debug.Assert(condition: false, message: message, localContext: mock.Object);

                mock.Verify(m => m.Trace(message), Times.Once);
            }
        }
    }
}
