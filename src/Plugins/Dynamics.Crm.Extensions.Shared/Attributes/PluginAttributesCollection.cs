using Dynamics.Crm.Core;
using System;
using System.Collections.Generic;

namespace Dynamics.Crm.Attributes
{
    public class PluginAttributesCollection
    {
        public IEnumerable<Attribute> Attributes { get; private set; }

        public IEnumerable<String> PipelineMessages { get; private set; }

        public IEnumerable<MessageProcessingStepMode> MessageProcessingStepModes { get; private set; }

        public IEnumerable<PipelineStage> PipelineStages { get; private set; }

        public String PrimaryEntityLogicalName { get; private set; }
        
        public PluginAttributesCollection(Type pluginType)
        {
            this.EnsureNotNull(pluginType);

            LoadAttributesFromType(pluginType);
        }

        private void LoadAttributesFromType(Type pluginType)
        {
            PipelineMessages = new String[0];
            MessageProcessingStepModes = new MessageProcessingStepMode[0];
            PipelineStages = new PipelineStage[0];

            var attributes = new List<Attribute>();

            var message = GetCustomAttribute<PipelineMessageAttribute>(pluginType);
            if (message != null)
            {
                attributes.Add(message);
                PipelineMessages = message.SupportedMessages;
            }

            var mode = GetCustomAttribute<PipelineModeAttribute>(pluginType);
            if (mode != null)
            {
                attributes.Add(mode);                
                MessageProcessingStepModes = mode.SupportedModes;
            }

            var stage = GetCustomAttribute<PipelineStageAttribute>(pluginType);
            if (stage != null)
            {
                attributes.Add(stage);                
                PipelineStages = stage.SupportedStages;
            }

            var entityName = GetCustomAttribute<PrimaryEntityAttribute>(pluginType);
            if (entityName != null)
            {
                attributes.Add(entityName);
                PrimaryEntityLogicalName = entityName.SupportedEntity;
            }
            
            Attributes = attributes.ToArray();
        }

        private TAttribute GetCustomAttribute<TAttribute>(Type pluginType)
            where TAttribute : Attribute
        {
            return (TAttribute)Attribute.GetCustomAttribute(pluginType, typeof(TAttribute));
        }
    }
}
