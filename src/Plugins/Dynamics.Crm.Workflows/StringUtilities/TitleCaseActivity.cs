using System;
using System.Activities;
using System.Globalization;

namespace Dynamics.Crm.Workflows.StringUtilities
{
    public class TitleCaseActivity : StringWorkflowActivityBase
    {
        protected override String Transform(ActivityContext context, String value)
        {
            if (value == null)
                return null;

            var text = CultureInfo.CurrentCulture.TextInfo;

            var result = text.ToTitleCase(value.ToLower());

            return result;
        }
    }
}
