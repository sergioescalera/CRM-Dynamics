#if WORKFLOWS
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;

namespace Dynamics.Crm.Interfaces
{
    public interface IWorkflowActivityContext
    {
        ICodeActivityContext ExecutionContext { get; }
        
        IOrganizationService OrganizationService { get; }

        ITracingService TracingService { get; }

        IWorkflowContext WorkflowContext { get; }
    }
}
#endif
