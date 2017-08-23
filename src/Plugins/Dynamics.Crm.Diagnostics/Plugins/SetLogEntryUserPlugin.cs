using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Plugins;
using Microsoft.Xrm.Sdk;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Diagnostics
{
    [PipelineMessage(Messages.Create)]
    [PipelineStage(PipelineStage.PreOperation)]
    [PipelineExecutionMode(ExecutionMode.Synchronous)]
    public class SetLogEntryUser : PluginBase
    {
        private readonly String _prefix;

        public SetLogEntryUser(String prefix)
        {
            _prefix = prefix ?? "cc";
        }

        protected override void Execute(IPluginContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            context.EnsureTargetLogicalName(LogEntryEntity.TypeName(_prefix));
            
            var target = context.GetTargetEntity();

            var user = target.GetAttributeValue<EntityReference>(LogEntryEntity.UserFieldName(_prefix));

            if (user == null)
            {
                user = new EntityReference(SystemUserEntity.TypeName, context.ExecutionContext.InitiatingUserId);

                target.AddOrUpdateAttribute(LogEntryEntity.UserFieldName(_prefix), user);
            }
        }
    }
}
