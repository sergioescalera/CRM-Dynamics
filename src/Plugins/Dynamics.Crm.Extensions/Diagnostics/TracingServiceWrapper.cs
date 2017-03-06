using Microsoft.Xrm.Sdk;
using System;
using System.Text;

namespace Dynamics.Crm.Diagnostics
{
    public class TracingServiceWrapper : ITracingService
    {
        protected ITracingService InnerTracingService { get; }

        protected StringBuilder StringBuilder { get; }

        public TracingServiceWrapper(ITracingService tracingService)
        {
            InnerTracingService = tracingService;
            StringBuilder = new StringBuilder();
        }

        public virtual void Trace(String format, params Object[] args)
        {
            InnerTracingService?.Trace(format, args);

            StringBuilder.AppendFormat(format, args);
            StringBuilder.AppendLine();
        }
    }
}
