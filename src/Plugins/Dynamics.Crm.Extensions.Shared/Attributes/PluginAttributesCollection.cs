using Dynamics.Crm.Core;
using Dynamics.Crm.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;

namespace Dynamics.Crm.Attributes
{
    public class PluginAttributesCollection : Collection<Attribute>
    {
        public IEnumerable<String> PipelineMessages { get; private set; }

        public IEnumerable<ExecutionMode> ExecutionModes { get; private set; }

        public IEnumerable<PipelineStage> PipelineStages { get; private set; }

        public String PrimaryEntityLogicalName { get; private set; }
        
        public PluginAttributesCollection(Type pluginType)
        {
            this.EnsureNotNull(pluginType);

            LoadAttributesFromType(pluginType);
        }

        private void LoadAttributesFromType(Type pluginType)
        {
            var message = pluginType.GetCustomAttribute<PipelineMessageAttribute>();
            var mode = pluginType.GetCustomAttribute<PipelineExecutionModeAttribute>();
            var stage = pluginType.GetCustomAttribute<PipelineStageAttribute>();
            var entity = pluginType.GetCustomAttribute<PrimaryEntityAttribute>();

            var attributes = new Attribute[] { message, mode, stage, entity };

            PipelineMessages = message?.Messages ?? Enumerable.Empty<String>();
            ExecutionModes = mode?.ExecutionModes ?? Enumerable.Empty<ExecutionMode>();
            PipelineStages = stage?.PipelineStages ?? Enumerable.Empty<PipelineStage>();

            PrimaryEntityLogicalName = entity?.EntityLogicalName ?? String.Empty;
            
            this.AddRange(
                attributes.Where(a => a != null));
        }
    }
}
