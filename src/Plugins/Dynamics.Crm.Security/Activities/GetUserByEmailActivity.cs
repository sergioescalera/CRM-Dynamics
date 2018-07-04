using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Linq;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Security.Activities
{
    public class GetUserByEmailActivity : WorkflowActivityBase
    {
        [Input("Email")]
        public InArgument<String> Email { get; set; }

        [Output("User")]
        [ReferenceTarget(SystemUserEntity.TypeName)]
        public OutArgument<EntityReference> User { get; set; }

        protected override void Execute(IWorkflowActivityContext context)
        {
            var executionContext = context.GetExecutionContext();

            var email = Email.Get(executionContext);

            if (email.IsNullOrEmpty())
                return;

            var user = GetUser(context, email);

            if (user == null)
                return;

            User.Set(executionContext, user.ToEntityReference());
        }

        private Entity GetUser(IWorkflowActivityContext context, String email)
        {
            var fetch = $@"<fetch distinct='true'>
<entity name='systemuser'>
    <attribute name='systemuserid' />
    <attribute name='fullname' />
    <filter type='and'>
        <condition attribute='internalemailaddress' value='{email.Trim()}' operator='eq' />
    </filter>
</entity>
</fetch>";

            var users = context.OrganizationService.FetchAll(fetch);

            return users.FirstOrDefault();
        }
    }
}
