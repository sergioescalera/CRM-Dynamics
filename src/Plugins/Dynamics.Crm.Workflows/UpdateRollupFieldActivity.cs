using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;

namespace Dynamics.Crm.Workflows
{
    public class UpdateRollupFieldActivity : WorkflowActivityBase
    {
        [Input("Entity Id")]
        [RequiredArgument]
        public InArgument<String> EntityId
        {
            get; set;
        }

        [Input("Entity Logical Name")]
        [RequiredArgument]
        public InArgument<String> EntityLogicalName
        {
            get; set;
        }

        [Input("Attribute Name")]
        [RequiredArgument]
        public InArgument<String> AttributeName
        {
            get; set;
        }

        protected override void Execute(IWorkflowActivityContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            var entityLogicalName = EntityLogicalName.Get(context.GetExecutionContext());
            var entityId = EntityId.Get(context.GetExecutionContext());
            var attributeName = AttributeName.Get(context.GetExecutionContext());

            CalculateRollupField(context, entityLogicalName, Guid.Parse(entityId), attributeName);
        }

        private void CalculateRollupField(
            IWorkflowActivityContext context,
            String entityLogicalName,
            Guid entityId,
            String attributeName)
        {
            this.EnsureNotNull(context, nameof(context));
            this.EnsureNotNull(entityLogicalName, nameof(entityLogicalName));
            this.EnsureNotEmpty(entityId);
            this.EnsureNotNull(attributeName, nameof(attributeName));

            var request = new CalculateRollupFieldRequest
            {
                FieldName = attributeName,
                Target = new EntityReference(entityLogicalName, entityId)
            };

            var response = context.OrganizationService.Execute<CalculateRollupFieldResponse>(request);
        }
    }
}
