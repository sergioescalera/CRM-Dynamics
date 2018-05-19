using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Workflows.StringUtilities
{
    public abstract class StringWorkflowActivityBase : WorkflowActivityBase
    {
        [Input("Input")]
        [RequiredArgument]
        public InArgument<String> Input
        {
            get; set;
        }

        [Output("Output")]
        public OutArgument<String> Output
        {
            get; set;
        }

        protected override void Execute(IWorkflowActivityContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            var activityContext = context.GetExecutionContext();

            var input = Input?.Get(activityContext);

            var output = Transform(activityContext, input);

            if (output.IsNotNull())
            {
                Output.Set(activityContext, output);
            }
        }

        protected abstract String Transform(ActivityContext context, String value);
    }
}