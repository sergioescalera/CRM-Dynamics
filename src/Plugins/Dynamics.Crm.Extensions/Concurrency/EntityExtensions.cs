using Dynamics.Crm.Data;
using Dynamics.Crm.Diagnostics;
using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Concurrency
{
    public static class EntityExtensions
    {
        const string DateFormat = "MM/dd/yyyy hh:mm:ss.fff tt";
                
        public static bool Lock(this IEntity entity, IPluginContext context, String concurrencyTokenFieldName = Schema.Common.ConcurrencyTokenFieldName)
        {
            ValidationHelper.EnsureNotNull(entity);
            
            return Lock(entity.Id, entity.TypeName, context, concurrencyTokenFieldName);
        }

        public static bool Lock(this Entity entity, IPluginContext context, String concurrencyTokenFieldName = Schema.Common.ConcurrencyTokenFieldName)
        {
            ValidationHelper.EnsureNotNull(entity);            

            return Lock(entity.Id, entity.LogicalName, context, concurrencyTokenFieldName);
        }

        private static bool Lock(Guid entityId, String entityTypeName, IPluginContext context, String concurrencyTokenFieldName)
        {
            ValidationHelper.EnsureNotNull(context, nameof(context));
            ValidationHelper.EnsureNotNull(concurrencyTokenFieldName, nameof(concurrencyTokenFieldName));
            ValidationHelper.EnsureNotNullOrWhiteSpace(concurrencyTokenFieldName);
                        
            if (!context.ExecutionContext.IsInTransaction)
            {
                context.TracingService.Trace($"Unable to lock {entityTypeName} record with id: {entityId}. Plug-in should run within the context of a transaction.");

                return false;
            }

            var update = new Entity(entityTypeName);
            var token = Guid.NewGuid();

            context.TracingService.Trace($"About to lock {entityTypeName} record with id: {entityId}. Concurrency token: {token}. {DateTime.Now.ToString(DateFormat)}");

            update.Id = entityId;
            update[concurrencyTokenFieldName] = token.ToString();

            context.OrganizationService.Update(update);

            context.TracingService.Trace($"The {entityTypeName} record with id: {entityId} is locked. Concurrency token: {token}. {DateTime.Now.ToString(DateFormat)}");

            return true;
        }
    }
}
