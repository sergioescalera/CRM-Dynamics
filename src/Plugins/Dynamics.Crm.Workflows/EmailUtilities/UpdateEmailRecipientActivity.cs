using Dynamics.Crm.Activities;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Workflows.EmailUtilities
{
    public class UpdateEmailRecipientActivity : WorkflowActivityBase
    {
        [Input("Target Email")]
        [ReferenceTarget(EmailEntity.TypeName)]
        [RequiredArgument]
        public InArgument<EntityReference> TargetEmail { get; set; }

        [Input("Apply To (To, Cc or Bcc)")]
        [RequiredArgument]
        public InArgument<String> ApplyTo
        {
            get; set;
        }

        [Input(nameof(Team))]
        [ReferenceTarget(TeamEntity.TypeName)]
        public InArgument<EntityReference> Team { get; set; }

        [Input(nameof(Role))]
        [ReferenceTarget(RoleEntity.TypeName)]
        public InArgument<EntityReference> Role { get; set; }

        protected override void Execute(IWorkflowActivityContext context)
        {
            this.EnsureNotNull(context, nameof(context));

            var activityContext = context.GetExecutionContext();

            var email = TargetEmail.Get(activityContext);
            var applyTo = ApplyTo.Get(activityContext);

            if (email == null)
                return;

            if (applyTo.IsNullOrWhiteSpace())
                return;

            var role = Role.Get(activityContext);
            var team = Team.Get(activityContext);

            if (role == null && team == null)
                return;

            var roleUsers = GetRoleUsers(context, role);

            context.TracingService.Trace($"Found {roleUsers?.Count()} for role {role?.Id}");

            var teamUsers = GetTeamUsers(context, team);

            context.TracingService.Trace($"Found {teamUsers?.Count()} for team {team?.Id}");

            var users = roleUsers.Union(teamUsers).ToArray();

            if (users.Any())
            {
                UpdateEmail(
                    context,
                    email,
                    applyTo,
                    users);
            }
        }

        private IEnumerable<Entity> GetTeamUsers(IWorkflowActivityContext context, EntityReference team)
        {
            if (team == null)
                return Enumerable.Empty<Entity>();

            var fetch = $@"<fetch distinct='true'>
<entity name='systemuser'>
    <attribute name='systemuserid'/>
    <attribute name='fullname'/>
    <order descending='false' attribute='fullname'/>
    <filter type='and'>
        <condition attribute='isdisabled' value='0' operator='eq'/>
        <condition attribute='accessmode' value='3' operator='ne'/>
        <condition attribute='accessmode' value='5' operator='ne'/>
    </filter>
    <link-entity name='teammembership' to='systemuserid' from='systemuserid'>
        <filter type='and'>
            <condition attribute='teamid' value='{team.Id}' operator='eq' />
        </filter>
    </link-entity>
</entity>
</fetch>";

            var entities = context.OrganizationService.FetchAll(fetch);

            return entities;
        }

        private IEnumerable<Entity> GetRoleUsers(IWorkflowActivityContext context, EntityReference role)
        {
            if (role == null)
                return Enumerable.Empty<Entity>();

            var fetch = $@"<fetch distinct='true'>
<entity name='systemuser'>
    <attribute name='systemuserid'/>
    <attribute name='fullname'/>
    <order descending='false' attribute='fullname'/>
    <filter type='and'>
        <condition attribute='isdisabled' value='0' operator='eq'/>
        <condition attribute='accessmode' value='3' operator='ne'/>
        <condition attribute='accessmode' value='5' operator='ne'/>
    </filter>
    <link-entity name='systemuserroles' to='systemuserid' from='systemuserid'>
        <filter type='and'>
            <condition attribute='roleid' value='{role.Id}' operator='eq' />
        </filter>
    </link-entity>
</entity>
</fetch>";

            var entities = context.OrganizationService.FetchAll(fetch);

            return entities;
        }

        private void UpdateEmail(
            IWorkflowActivityContext context,
            EntityReference email,
            String applyTo,
            Entity[] users)
        {
            var attribute = applyTo.ToLower().Trim();
            var entity = context.OrganizationService.Retrieve(email.LogicalName, email.Id, attribute);

            var collection = entity.GetAttributeValue<EntityCollection>(attribute);

            entity.AddOrUpdateAttribute(attribute, MergeActivityPartyList(collection, users));

            context.OrganizationService.Update(entity);
        }

        private EntityCollection MergeActivityPartyList(EntityCollection collection, params Entity[] entities)
        {
            var array = entities
                .Select(entity =>
                {
                    if (collection?.Entities?.Any(
                        e => e.GetAttributeValue<EntityReference>(
                            ActivityPartyEntity.PartyFieldName)?.Id == entity.Id) == true)
                    {
                        return null;
                    }

                    var party = new Entity(ActivityPartyEntity.TypeName);

                    party.AddOrUpdateAttribute(ActivityPartyEntity.PartyFieldName, entity.ToEntityReference());

                    return party;
                })
                .Where(entity => entity.IsNotNull())
                .ToArray();

            return new EntityCollection(array.Union(collection.Entities).ToList());
        }
    }
}
