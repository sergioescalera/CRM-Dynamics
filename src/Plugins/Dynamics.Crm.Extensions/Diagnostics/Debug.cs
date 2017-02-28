using Dynamics.Crm.Interfaces;
using System;
using System.Diagnostics;

namespace Dynamics.Crm.Diagnostics
{
    public static class Debug
    {
        [Conditional("DEBUG")]
        public static void Assert(Boolean condition, String message, IPluginContext localContext)
        {
            ValidationHelper.EnsureNotNull(localContext, nameof(localContext));
            
            if (condition) return;

            localContext.Trace(message ?? String.Empty);
        }
    }
}
