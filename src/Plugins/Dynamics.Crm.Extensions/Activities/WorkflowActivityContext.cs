using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Activities
{
    public class WorkflowActivityContext : IWorkflowActivityContext
    {
        public WorkflowActivityContext(ICodeActivityContext activityContext)
        {
            this.EnsureNotNull(activityContext);

            ExecutionContext = activityContext;
            WorkflowContext = activityContext.GetExtension<IWorkflowContext>();
            ServiceFactory = activityContext.GetExtension<IOrganizationServiceFactory>();
            OrganizationService = ServiceFactory.CreateOrganizationService(WorkflowContext.UserId);

            if (WorkflowContext == null)
            {
                throw new InvalidPluginExecutionException("Failed to retrieve workflow context.");
            }
        }

        public ICodeActivityContext ExecutionContext
        {
            get;
            private set;
        }

        public IOrganizationService OrganizationService
        {
            get;
            private set;
        }

        public IOrganizationServiceFactory ServiceFactory
        {
            get;
            private set;
        }

        public IWorkflowContext WorkflowContext
        {
            get;
            private set;
        }
    }
}
