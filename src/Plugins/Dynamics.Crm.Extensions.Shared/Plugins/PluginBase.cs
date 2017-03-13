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
            var pluginType = GetType();
            var context = GetPluginContext(serviceProvider);
            
            try
            {
                Validate(context, pluginType);
                stopwatch.Start();
                Execute(context);
                stopwatch.Stop();
            }            
            catch (Exception e)
            {
                CreateLogEntryFromException(context, e);

                throw;
            }
        }

        protected abstract void Execute(IPluginContext context);

        protected virtual IPluginContext GetPluginContext(IServiceProvider serviceProvider)
        {
            return new PluginContext(serviceProvider);
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

        protected virtual void CreateLogEntryFromException(IPluginContext context, Exception exception)
        {
            var action = (Action)(() =>
            {
                var name = GetType().FullName;
                var trace = context.TracingService.ToString();

                var entry = LogEntry.CreateFromException(exception, name, trace);

                var repository = new LogEntryRepository(context);

                repository.Create(entry);
            });

            action.Catch(ex => context.TracingService.Trace(ex.ToString()));                     
        }
    }
}
