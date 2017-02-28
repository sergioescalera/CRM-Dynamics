using Dynamics.Crm.Core;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PipelineStageAttribute : Attribute
    {
        public PipelineStage[] SupportedStages
        {
            get;
            private set;
        }

        public PipelineStageAttribute(params PipelineStage[] supportedStages)
        {
            this.EnsureNotNull(supportedStages);

            SupportedStages = supportedStages.ToArray();
        }
    }
}
