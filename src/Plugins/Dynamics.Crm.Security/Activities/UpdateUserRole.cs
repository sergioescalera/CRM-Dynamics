using Dynamics.Crm.Activities;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Security.Activities
{
    public class UpdateUserRole : WorkflowActivityBase
    {
        [Input("User")]
        [ReferenceTarget("systemuser")]
        public InArgument<EntityReference> UserId { get; set; }

        [Input("Role")]
        [ReferenceTarget("role")]
        public InArgument<EntityReference> RoleId { get; set; }

        [Input("Remove Role?")]
        [ArgumentDescription("Set to true to remove role, otherwise role will be applied to user")]
        public InArgument<Boolean> Remove { get; set; }

        protected override void Execute(IWorkflowActivityContext context)
        {
            var user = UserId.Get(context.ExecutionContext.InnerContext);
            var role = RoleId.Get(context.ExecutionContext.InnerContext);
            var remove = Remove.Get(context.ExecutionContext.InnerContext);

            if (user == null || role == null)
                return;

            var relationship = "systemuserroles_association";

            if (remove)
            {
                context.OrganizationService.Disassociate(
                    user.LogicalName,
                    user.Id,
                    new Relationship(relationship),
                    new EntityReferenceCollection { role });
            }
            else
            {
                context.OrganizationService.Associate(
                    user.LogicalName,
                    user.Id,
                    new Relationship(relationship),
                    new EntityReferenceCollection { role });
            }
        }
    }
}
