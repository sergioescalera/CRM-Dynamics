using Dynamics.Crm.Attributes;
using Dynamics.Crm.Data;
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
        private readonly string _prefix;

        protected PluginBase(String prefix = Schema.DefaultPrefix)
        {
            this.EnsureNotNull(prefix);

            _prefix = prefix;
        }

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
                catch (Exception e)
                {
                    context.TracingService?.Trace(e.StackTrace);

                    if (ShouldCreateLogEntry(context, e))
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

            var message = $@"BusinessUnitId: {executionContext?.BusinessUnitId}
CorrelationId: {executionContext?.CorrelationId}
Depth: {executionContext?.Depth}
InitiatingUserId: {executionContext?.InitiatingUserId}
MessageName: {executionContext?.MessageName}
Mode: {executionContext?.Mode}
PrimaryEntityId: {executionContext?.PrimaryEntityId}
PrimaryEntityName: {executionContext?.PrimaryEntityName}
UserId: {executionContext?.UserId}";

            context.TracingService.Trace(message);
        }

        protected virtual void Validate(IPluginContext context, Type pluginType)
        {
            var attributes = new PluginAttributesCollection(pluginType);

            if (attributes.ExecutionModes.Any())
            {
                context.EnsureSupportedExecutionMode(attributes.ExecutionModes.ToArray());
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

                var entry = LogEntry.CreateFromException(
                    exception,
                    name, 
                    trace,
                    type: type,
                    prefix: _prefix);

                var repository = new LogEntryRepository(_prefix, context);

                repository.Create(entry);
            });

            action.Catch(ex => context.TracingService.Trace(ex.ToString()));                     
        }

        protected virtual Boolean ShouldCreateLogEntry(IPluginContext context, Exception exception)
        {
            return true;
        }
    }
}
