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
    [PipelineExecutionMode(ExecutionMode.Synchronous)]
    [PipelineMessage(Messages.Update)]
    public class ReadonlyAttributesPlugin : PluginBase
    {
        private readonly IEnumerable<String> _attributes;

        const string message = "{0} is read-only.";

        public ReadonlyAttributesPlugin(String unsecureConfig)
        {
            _attributes = unsecureConfig?.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries) ?? Enumerable.Empty<String>();
        }

        protected override void Execute(IPluginContext local)
        {
            var attributes = _attributes;

            if (attributes == null)
                return;

            var target = local.GetTargetEntity();
            var image = local.GetEntityImage(EntityImageType.PreImage);

            var messages = new StringBuilder();

            foreach (var attribute in attributes)
            {
                var tuple = Helper.GetAttributeNameAndLabel(attribute);

                if (!target.EnsureAttributeReadOnly(image, tuple.Item1))
                    messages.AppendLine(String.Format(message, tuple.Item2));
            }

            if (messages.Length > 0)
                throw new InvalidPluginExecutionException(messages.ToString().TrimEnd('\r', '\n'));
        }
    }
}
