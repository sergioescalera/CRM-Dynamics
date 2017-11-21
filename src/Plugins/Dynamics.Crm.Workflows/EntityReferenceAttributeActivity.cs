using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Workflows
{
    public class EntityReferenceAttributeActivity : WorkflowActivityBase
    {
        [Input("Attribute Name")]
        [RequiredArgument]
        public InArgument<String> AttributeName
        {
            get; set;
        }

        [Output("Entity Id")]
        public OutArgument<String> EntityId
        {
            get; set;
        }

        [Output("Entity Logical Name")]
        public OutArgument<String> EntityLogicalName
        {
            get; set;
        }

        protected override void Execute(IWorkflowActivityContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            var activityContext = context.GetExecutionContext();

            var primaryEntityId = context.WorkflowContext.PrimaryEntityId;
            var primaryEntityName = context.WorkflowContext.PrimaryEntityName;
            var attributeName = AttributeName.Get(activityContext);
            var primaryEntity = RetrievePrimaryEntity(context, primaryEntityName, primaryEntityId, attributeName);

            var value = primaryEntity?.GetAttributeValue<Object>(attributeName);

            if (value == null)
                return;

            if (!(value is EntityReference))
                throw new InvalidPluginExecutionException($"Invalid field value type {value.GetType().FullName}.");

            var entityReference = (EntityReference)value;

            EntityLogicalName.Set(activityContext, entityReference.LogicalName);
            EntityId.Set(activityContext, entityReference.Id.ToString());
        }

        private Entity RetrievePrimaryEntity(
            IWorkflowActivityContext context,
            String entityLogicalName,
            Guid entityId,
            String attributeName)
        {
            this.EnsureNotNull(context, nameof(context));
            this.EnsureNotNull(entityLogicalName, nameof(entityLogicalName));
            this.EnsureNotEmpty(entityId);
            this.EnsureNotNull(attributeName, nameof(attributeName));

            return context.OrganizationService.Retrieve(entityLogicalName, entityId, attributeName);
        }
    }
}
