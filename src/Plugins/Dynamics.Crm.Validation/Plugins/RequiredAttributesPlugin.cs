using Dynamics.Crm.Attributes;
using Dynamics.Crm.Core;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Plugins;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamics.Crm.Validation.Plugins
{
    [PipelineStage(PipelineStage.PreOperation)]
    [PipelineMode(MessageProcessingStepMode.Synchronous)]
    [PipelineMessage(Messages.Create, Messages.Update)]
    public class RequiredAttributesPlugin : PluginBase
    {
        private readonly IEnumerable<String> _attributes;

        const string message = "You must provide a value for {0}.";

        public RequiredAttributesPlugin(String unsecureConfig)
        {
            _attributes = unsecureConfig?.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries) ?? Enumerable.Empty<String>();
        }
        
        protected override void Execute(IPluginContext context)
        {
            var attributes = _attributes;

            if (attributes == null)
                return;

            var target = context.GetTargetEntity();

            var create = context.IsCreateMessage();

            var messages = new StringBuilder();

            foreach (var attribute in attributes)
            {
                var tuple = Helper.GetAttributeNameAndLabel(attribute);

                if (create && !target.EnsureAttributeRequired(tuple.Item1))
                    messages.AppendLine(String.Format(message, tuple.Item2));

                else if (!create && !target.EnsureAttributeRequired(tuple.Item1, ensureAttributePresent: false))
                    messages.AppendLine(String.Format(message, tuple.Item2));
            }

            if (messages.Length > 0)
                throw new InvalidPluginExecutionException(messages.ToString());
        }
    }
}
