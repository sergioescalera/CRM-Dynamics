using System;
using System.Linq;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PipelineMessageAttribute : Attribute
    {
        public String[] Messages
        {
            get;
            private set;
        }

        public PipelineMessageAttribute(params String[] messages)
        {
            this.EnsureNotNull(messages);

            Messages = messages.ToArray();
        }
    }
}