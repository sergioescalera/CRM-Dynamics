using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Plugins;

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
        }
    }
}
