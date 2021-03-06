﻿using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Security.Activities
{
    public class CurrentUserActivity : WorkflowActivityBase
    {
        [Output("User")]
        [ReferenceTarget(SystemUserEntity.TypeName)]
        public OutArgument<EntityReference> User { get; set; }

        protected override void Execute(IWorkflowActivityContext context)
        {
            var executionContext = context.GetExecutionContext();

            var user = new EntityReference("systemuser", context.WorkflowContext.InitiatingUserId);

            User.Set(executionContext, user);
        }
    }
}
