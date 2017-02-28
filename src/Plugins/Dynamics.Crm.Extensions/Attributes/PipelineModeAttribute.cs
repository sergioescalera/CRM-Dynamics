using Dynamics.Crm.Core;
using System;
using System.Linq;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PipelineModeAttribute : Attribute
    {
        public MessageProcessingStepMode[] SupportedModes
        {
            get;
            private set;
        }

        public PipelineModeAttribute(params MessageProcessingStepMode[] supportedModes)
        {
            this.EnsureNotNull(supportedModes);

            SupportedModes = supportedModes.ToArray();
        }
    }
}
