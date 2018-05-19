using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Workflows.StringUtilities
{
    public class SubstringActivity : StringWorkflowActivityBase
    {
        [Input("Index")]
        [RequiredArgument]
        public InArgument<Int32> Index
        {
            get; set;
        }

        [Input("Length")]
        [RequiredArgument]
        public InArgument<Int32> Length
        {
            get; set;
        }

        protected override String Transform(ActivityContext context, String value)
        {
            var index = Index.Get(context);
            var length = Length.Get(context);

            return value?.Substring(index, length);
        }
    }
}
