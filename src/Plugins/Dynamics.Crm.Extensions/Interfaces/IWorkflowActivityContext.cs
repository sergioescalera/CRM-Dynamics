using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;

namespace Dynamics.Crm.Interfaces
{
    public interface IWorkflowActivityContext
    {
        ICodeActivityContext ExecutionContext { get; }
        
        IOrganizationService OrganizationService { get; }

        IWorkflowContext WorkflowContext { get; }
    }
}
