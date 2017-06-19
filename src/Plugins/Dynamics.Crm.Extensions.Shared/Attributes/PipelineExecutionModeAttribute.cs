using Dynamics.Crm.Core;
using System;
using System.Linq;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PipelineExecutionModeAttribute : Attribute
    {
        public ExecutionMode[] ExecutionModes
        {
            get;
            private set;
        }

        public PipelineExecutionModeAttribute(params ExecutionMode[] executionModes)
        {
            this.EnsureNotNull(executionModes);

            ExecutionModes = executionModes.ToArray();
        }
    }
}
