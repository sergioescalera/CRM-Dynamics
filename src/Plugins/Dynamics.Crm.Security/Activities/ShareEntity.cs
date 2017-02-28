using Dynamics.Crm.Activities;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;

namespace Dynamics.Crm.Security.Activities
{
    public class ShareEntity : ShareWorkflowActivityBase
    {
        protected override void Execute(IWorkflowActivityContext context)
        {
            var entityId = context.WorkflowContext.PrimaryEntityId;
            var entityName = context.WorkflowContext.PrimaryEntityName;

            var entity = new EntityReference(entityName, entityId);

            Share(context, entity);
        }
    }
}
