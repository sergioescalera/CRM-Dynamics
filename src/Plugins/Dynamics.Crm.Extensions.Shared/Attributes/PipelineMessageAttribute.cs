using System;
using System.Linq;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PipelineMessageAttribute : Attribute
    {
        public String[] SupportedMessages
        {
            get;
            private set;
        }

        public PipelineMessageAttribute(params String[] supportedMessages)
        {
            this.EnsureNotNull(supportedMessages);

            SupportedMessages = supportedMessages.ToArray();
        }
    }
}