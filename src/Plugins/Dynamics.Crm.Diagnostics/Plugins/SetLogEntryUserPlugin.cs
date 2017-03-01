using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Plugins;
using Microsoft.Xrm.Sdk;

namespace Dynamics.Crm.Diagnostics
{
    [PrimaryEntity(Schema.LogEntryEntity.TypeName)]
    [PipelineMessage(Messages.Create)]
    [PipelineStage(PipelineStage.PreOperation)]
    [PipelineMode(MessageProcessingStepMode.Synchronous)]
    public class SetLogEntryUser : PluginBase
    {
        protected override void Execute(IPluginContext context)
        {
            var target = context.GetTargetEntity();

            var user = target.GetAttributeValue<EntityReference>(Schema.LogEntryEntity.UserFieldName);

            if (user == null)
            {
                user = new EntityReference(Schema.SystemUserEntity.TypeName, context.ExecutionContext.InitiatingUserId);

                target.AddOrUpdateAttribute(Schema.LogEntryEntity.UserFieldName, user);
            }
        }
    }
}
