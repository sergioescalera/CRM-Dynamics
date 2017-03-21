using Dynamics.Crm.Core;
using Dynamics.Crm.Plugins;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Linq;

namespace Dynamics.Crm.Interfaces
{
    public static class PluginContextExtensions
    {
        #region LINQ Context

        public static OrganizationServiceContext GetOrganizationServiceContext(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            if (pluginContext is PluginContext)            
                return ((PluginContext)pluginContext).OrganizationServiceContext.Value;
            
            return new OrganizationServiceContext(pluginContext.OrganizationService);
        }

        #endregion

        #region Target

        public static Entity GetTargetEntity(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            if (pluginContext.GetTargetEntityType() == TargetType.Entity)
            {   
                return (Entity)pluginContext.ExecutionContext.InputParameters["Target"];
            }

            return null;
        }

        public static EntityReference GetTargetEntityReference(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            if (pluginContext.GetTargetEntityType() == TargetType.EntityReference)
            {
                return (EntityReference)pluginContext.ExecutionContext.InputParameters["Target"];
            }

            return null;
        }

        public static TargetType GetTargetEntityType(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            var executionContext = pluginContext.ExecutionContext;

            if (!executionContext.InputParameters.Contains("Target"))
                return TargetType.Undefined;

            var target = executionContext.InputParameters["Target"];

            if (target is Entity)
                return TargetType.Entity;

            if (target is EntityReference)
                return TargetType.EntityReference;

            return TargetType.Undefined;            
        }

        #endregion

        #region Entity Image

        public static Entity GetEntityImage(this IPluginContext pluginContext, EntityImageType imageType, Boolean throwIfNull = false)
        {
            return pluginContext.GetEntityImage(imageType.ToString(), imageType, throwIfNull);
        }

        public static Entity GetEntityImage(this IPluginContext pluginContext, String imageName, EntityImageType imageType, Boolean throwIfNull = false)
        {
            ValidationHelper.EnsureNotNull(pluginContext, nameof(pluginContext));
            ValidationHelper.EnsureNotNull(imageName, nameof(imageName));

            var images = default(EntityImageCollection);

            if (imageType == EntityImageType.PreImage)
            {
                images = pluginContext.ExecutionContext.PreEntityImages;
            }
            else
            {
                images = pluginContext.ExecutionContext.PostEntityImages;
            }

            if (images.Contains(imageName))
            {
                return images[imageName];
            }

            if (throwIfNull)
            {
                throw new InvalidPluginExecutionException($"Required image not found: {imageType}");
            }

            return null;
        }

        #endregion

        #region Message Type

        public static Boolean IsCreateMessage(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            return String.Equals(pluginContext.ExecutionContext.MessageName, Messages.Create, StringComparison.OrdinalIgnoreCase);
        }

        public static Boolean IsDeleteMessage(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            return String.Equals(pluginContext.ExecutionContext.MessageName, Messages.Delete, StringComparison.OrdinalIgnoreCase);
        }

        public static Boolean IsUpdateMessage(this IPluginContext pluginContext)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            return String.Equals(pluginContext.ExecutionContext.MessageName, Messages.Update, StringComparison.OrdinalIgnoreCase);
        }

        #endregion

        #region Plugin Validation

        public static void EnsureSupportedExecutionMode(this IPluginContext pluginContext, params MessageProcessingStepMode[] supportedProcessingSteps)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            var mode = pluginContext.ExecutionContext.GetStepMode();

            if (!supportedProcessingSteps.Contains(mode))
                InvalidPluginRegistration("Processing Step Mode", mode);
        }

        public static void EnsureSupportedMessage(this IPluginContext pluginContext, params String[] supportedMessages)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            var messageName = pluginContext.ExecutionContext.MessageName;

            if (!supportedMessages.Any(m => String.Equals(m, messageName, StringComparison.OrdinalIgnoreCase)))
                InvalidPluginRegistration("Pipeline Message", messageName);
        }

        public static void EnsureSupportedPipelineStage(this IPluginContext pluginContext, params PipelineStage[] supportedPipelineStages)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            var stage = pluginContext.ExecutionContext.GetPipelineStage();

            if (!supportedPipelineStages.Contains(stage))
                InvalidPluginRegistration("Pipeline Stage", stage);
        }

        public static void EnsureTargetLogicalName(this IPluginContext pluginContext, String expectedLogicalName)
        {
            ValidationHelper.EnsureNotNull(pluginContext);

            var primaryEntityName = pluginContext.ExecutionContext.PrimaryEntityName;

            if (!String.Equals(expectedLogicalName, primaryEntityName, StringComparison.OrdinalIgnoreCase))
                InvalidPluginRegistration("Primary Entity", primaryEntityName);
        }

        private static void InvalidPluginRegistration(String name, Object value)
        {
            throw new InvalidPluginExecutionException($"Invalid plug-in registration. {name} ({value}) not supported. Please verify the plug-in registration.");
        }

        #endregion
    }
}
