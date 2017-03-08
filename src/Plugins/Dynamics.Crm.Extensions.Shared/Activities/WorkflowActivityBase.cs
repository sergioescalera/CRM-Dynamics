#if WORKFLOWS
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;
using System.Activities;
using System.Diagnostics;
using System.ServiceModel;

namespace Dynamics.Crm.Activities
{
    public abstract class WorkflowActivityBase : CodeActivity
    {
        protected override void Execute(CodeActivityContext executionContext)
        {
            var stopwatch = new Stopwatch();
            var pluginType = GetType();
            var context = GetCodeActivityContext(executionContext);

            try
            {
                stopwatch.Start();
                Execute(context);
                stopwatch.Stop();
            }            
            catch (Exception)
            {
                // TODO
                throw;
            }
        }

        protected abstract void Execute(IWorkflowActivityContext context);

        protected virtual IWorkflowActivityContext GetCodeActivityContext(CodeActivityContext executionContext)
        {
            return new WorkflowActivityContext(new CodeActivityContextWrapper(executionContext));
        }
    }
}
#endif
