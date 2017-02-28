using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Plugins;
using System;

namespace SamplePluginLibrary
{
    [PrimaryEntity(Schema.AccountEntity.TypeName)]
    [PipelineMessage(Messages.Create)]
    [PipelineStage(PipelineStage.PreOperation)]
    [PipelineMode(MessageProcessingStepMode.Synchronous)]
    public class SampleAccountPlugin : PluginBase
    {
        protected override void Execute(IPluginContext context)
        {
            var target = context.GetTargetEntity();

            var name = target.GetAttributeValue<String>(Schema.Common.NameFieldName);

            name += Guid.NewGuid();

            target.AddOrUpdateAttribute(Schema.Common.NameFieldName, name);
        }
    }
}
