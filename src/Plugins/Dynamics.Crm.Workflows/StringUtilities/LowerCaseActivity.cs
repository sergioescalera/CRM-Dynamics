using System;
using System.Activities;

namespace Dynamics.Crm.Workflows.StringUtilities
{
    public class LowerCaseActivity : StringWorkflowActivityBase
    {
        protected override String Transform(ActivityContext context, String value)
        {
            return value?.ToLower();
        }
    }
}
