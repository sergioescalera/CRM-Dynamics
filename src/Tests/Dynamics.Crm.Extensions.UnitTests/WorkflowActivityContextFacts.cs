using Dynamics.Crm.Activities;
using Dynamics.Crm.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using Moq;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class WorkflowActivityContextFacts
    {
        static ICodeActivityContext CreateCodeActivityContext()
        {
            var userId = Guid.NewGuid();
            var activityContext = new Mock<ICodeActivityContext>();
            var workflowContext = new Mock<IWorkflowContext>();
            var serviceFactory = new Mock<IOrganizationServiceFactory>();
            var service = new Mock<IOrganizationService>();
            
            activityContext
                .Setup(o => o.GetExtension<IWorkflowContext>())
                .Returns(workflowContext.Object);
            activityContext
                .Setup(o => o.GetExtension<IOrganizationServiceFactory>())
                .Returns(serviceFactory.Object);

            workflowContext
                .Setup(o => o.UserId)
                .Returns(userId);

            serviceFactory
                .Setup(o => o.CreateOrganizationService(userId))
                .Returns(service.Object);

            return activityContext.Object;
        }

        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullActivityContext()
            {
                new WorkflowActivityContext(null);
            }

            [TestMethod]
            public void InitializesNewInstanceForValidServiceProvider()
            {
                var executionContext = CreateCodeActivityContext();

                var context = new WorkflowActivityContext(executionContext);

                Assert.IsNotNull(context);
                Assert.IsNotNull(context.ExecutionContext);
                Assert.IsNotNull(context.OrganizationService);
                Assert.IsNotNull(context.ServiceFactory);
                Assert.IsNotNull(context.WorkflowContext);
            }
        }
    }
}
