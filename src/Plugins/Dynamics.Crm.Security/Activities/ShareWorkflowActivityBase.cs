using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Security.Activities
{
    public abstract class ShareWorkflowActivityBase : WorkflowActivityBase
    {
        [Input("User")]
        [ReferenceTarget("systemuser")]
        public InArgument<EntityReference> UserId { get; set; }

        [Input("Team")]
        [ReferenceTarget("team")]
        public InArgument<EntityReference> TeamId { get; set; }

        [Input("Read")]
        [Default("true")]
        public InArgument<Boolean> Read { get; set; }

        [Input("Append")]
        [Default("true")]
        public InArgument<Boolean> Append { get; set; }

        [Input("AppendTo")]
        [Default("true")]
        public InArgument<Boolean> AppendTo { get; set; }

        [Input("Write")]
        [Default("false")]
        public InArgument<Boolean> Write { get; set; }

        [Input("Delete")]
        [Default("false")]
        public InArgument<Boolean> Delete { get; set; }

        [Input("Share")]
        [Default("false")]
        public InArgument<Boolean> ShareAccess { get; set; }

        [Input("Assign")]
        [Default("false")]
        public InArgument<Boolean> AssignAccess { get; set; }

        protected virtual void Share(IWorkflowActivityContext context, EntityReference entity)
        {
            var user = UserId.Get(context.GetExecutionContext());
            var team = TeamId.Get(context.GetExecutionContext());

            if (user != null)
                Share(context, entity, user);

            if (team != null)
                Share(context, entity, team);
        }

        protected virtual void Share(IWorkflowActivityContext context, EntityReference entity, EntityReference principal)
        {
            var mask = GetMask(context);

            if (mask == AccessRights.None)
                return;

            var request = new GrantAccessRequest
            {
                PrincipalAccess = new PrincipalAccess
                {
                    AccessMask = mask,
                    Principal = principal
                },
                Target = entity
            };

            var response = context.OrganizationService.Execute<GrantAccessResponse>(request);
        }

        protected virtual AccessRights GetMask(IWorkflowActivityContext context)
        {
            var mask = AccessRights.None;

            if (Read.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.ReadAccess;

            if (Append.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.AppendAccess;

            if (AppendTo.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.AppendToAccess;

            if (Read.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.ReadAccess;

            if (Write.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.WriteAccess;

            if (Delete.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.DeleteAccess;

            if (AssignAccess.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.AssignAccess;

            if (ShareAccess.Get(context.GetExecutionContext()))
                mask = mask | AccessRights.ShareAccess;

            return mask;
        }
    }
}