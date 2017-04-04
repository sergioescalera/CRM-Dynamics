using Dynamics.Crm.Attributes;
using Dynamics.Crm.Data;
using Dynamics.Crm.Extensions;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Models;
using Microsoft.Xrm.Sdk;
using System;
using System.Diagnostics;
using System.Linq;

namespace Dynamics.Crm.Plugins
{
    public abstract class PluginBase : IPlugin
    {
        public virtual void Execute(IServiceProvider serviceProvider)
        {
            var stopwatch = new Stopwatch();
            var baseType = typeof(PluginBase);
            var pluginType = GetType();
            
            using (var context = GetPluginContext(serviceProvider))
            {
                try
                {
                    context.TracingService.Trace($"{baseType.FullName}.Execute");

                    TraceExecutionContext(context);
                    Validate(context, pluginType);
                    stopwatch.Start();
                    context.TracingService.Trace($"{pluginType.FullName}.Execute");
                    Execute(context);
                    stopwatch.Stop();
                }
                catch (InvalidPluginExecutionException e)
                {
                    context.TracingService?.Trace(e.StackTrace);
                    
                    if (CreateLogEntryForInvalidPluginExecutionException)
                    {
                        CreateLogEntryFromException(context, e);
                    }

                    throw;
                }
                catch (Exception e)
                {
                    context.TracingService?.Trace(e.StackTrace);

                    CreateLogEntryFromException(context, e);

                    throw;
                }
            }
        }

        protected abstract void Execute(IPluginContext context);

        protected virtual IPluginContext GetPluginContext(IServiceProvider serviceProvider)
        {
            return new PluginContext(serviceProvider);
        }

        protected virtual void TraceExecutionContext(IPluginContext context)
        {
            var executionContext = context.ExecutionContext;

            context.TracingService.Trace($"BusinessUnitId: {executionContext?.BusinessUnitId}");
            context.TracingService.Trace($"CorrelationId: {executionContext?.CorrelationId}");
            context.TracingService.Trace($"Depth: {executionContext?.Depth}");
            context.TracingService.Trace($"InitiatingUserId: {executionContext?.InitiatingUserId}");
            context.TracingService.Trace($"MessageName: {executionContext?.MessageName}");
            context.TracingService.Trace($"Mode: {executionContext?.Mode}");
            context.TracingService.Trace($"PrimaryEntityId: {executionContext?.PrimaryEntityId}");
            context.TracingService.Trace($"PrimaryEntityName: {executionContext?.PrimaryEntityName}");
            context.TracingService.Trace($"UserId: {executionContext?.UserId}");
        }

        protected virtual void Validate(IPluginContext context, Type pluginType)
        {
            var attributes = new PluginAttributesCollection(pluginType);

            if (attributes.MessageProcessingStepModes.Any())
            {
                context.EnsureSupportedExecutionMode(attributes.MessageProcessingStepModes.ToArray());
            }

            if (attributes.PipelineStages.Any())
            {
                context.EnsureSupportedPipelineStage(attributes.PipelineStages.ToArray());
            }

            if (attributes.PipelineMessages.Any())
            {
                context.EnsureSupportedMessage(attributes.PipelineMessages.ToArray());
            }

            if (!String.IsNullOrWhiteSpace(attributes.PrimaryEntityLogicalName))
            {
                context.EnsureTargetLogicalName(attributes.PrimaryEntityLogicalName);
            }
        }

        protected virtual void CreateLogEntryFromException(
            IPluginContext context,
            Exception exception,
            LogEntryType type = LogEntryType.Error)
        {
            var action = (Action)(() =>
            {
                var name = GetType().FullName;
                var trace = context.TracingService.ToString();

                var entry = LogEntry.CreateFromException(exception, name, trace, type: type);

                var repository = new LogEntryRepository(context);

                repository.Create(entry);
            });

            action.Catch(ex => context.TracingService.Trace(ex.ToString()));                     
        }

        protected virtual Boolean CreateLogEntryForInvalidPluginExecutionException
        {
            get
            {
                return true;
            }
        }
    }
}
