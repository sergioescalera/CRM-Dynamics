using Dynamics.Crm.Interfaces;
using System.Activities;

namespace Dynamics.Crm.Extensions
{
    public static class WorkflowActivityContextExtensions
    {
        public static CodeActivityContext GetExecutionContext(this IWorkflowActivityContext executionContext)
        {
            return executionContext.ExecutionContext.InnerContext;
        }
    }
}
