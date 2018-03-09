using Microsoft.Xrm.Sdk;
using System;
using System.Linq;
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

            if (args.Any())
            {
                StringBuilder.AppendFormat(format, args);
            }
            else
            {
                StringBuilder.Append(format);
            }
            StringBuilder.AppendLine();
        }

        public override string ToString()
        {
            return StringBuilder?.ToString();
        }
    }
}
