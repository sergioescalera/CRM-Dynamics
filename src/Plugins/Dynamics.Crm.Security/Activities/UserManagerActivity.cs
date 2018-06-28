using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Security.Activities
{
    public class UserManagerActivity : WorkflowActivityBase
    {
        [Input("User")]
        [ReferenceTarget("systemuser")]
        public InArgument<EntityReference> User { get; set; }

        [Output("Manager")]
        [ReferenceTarget("systemuser")]
        public InArgument<EntityReference> Manager { get; set; }

        protected override void Execute(IWorkflowActivityContext context)
        {
            var executionContext = context.GetExecutionContext();

            var user = User.Get(executionContext);

            if (user == null)
                return;

            var manager = context.OrganizationService.Retrieve(
                user.LogicalName,
                user.Id,
                SystemUserEntity.ManagerFieldName)?.GetAttributeValue<EntityReference>(SystemUserEntity.ManagerFieldName);

            if (manager == null)
                return;

            Manager.Set(executionContext, manager);
        }
    }
}
