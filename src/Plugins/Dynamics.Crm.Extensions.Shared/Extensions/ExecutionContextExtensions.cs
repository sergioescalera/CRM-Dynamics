using Dynamics.Crm.Core;
using System;

namespace Microsoft.Xrm.Sdk
{
    public static class ExecutionContextExtensions
    {
        public static ExecutionMode GetStepMode(this IExecutionContext context)
        {
            ValidationHelper.EnsureNotNull(context);
            
            return (ExecutionMode)context.Mode;
        }

        public static PipelineStage GetPipelineStage(this IPluginExecutionContext context)
        {
            ValidationHelper.EnsureNotNull(context);
            
            return (PipelineStage)context.Stage;
        }
    }
}
