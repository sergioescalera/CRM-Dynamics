using Dynamics.Crm.Core;
using System;
using System.Linq;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PipelineStageAttribute : Attribute
    {
        public PipelineStage[] PipelineStages
        {
            get;
            private set;
        }

        public PipelineStageAttribute(params PipelineStage[] pipelineStages)
        {
            this.EnsureNotNull(pipelineStages);

            PipelineStages = pipelineStages.ToArray();
        }
    }
}
