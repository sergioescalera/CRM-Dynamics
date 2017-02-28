using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Plugins
{
    public class PluginContext : IPluginContext
    {
        public PluginContext(IServiceProvider serviceProvider)
        {
            this.EnsureNotNull(serviceProvider);

            ServiceProvider = serviceProvider;

            ExecutionContext = serviceProvider.GetService<IPluginExecutionContext>();
            OrganizationServiceFactory = serviceProvider.GetService<IOrganizationServiceFactory>();
            OrganizationService = OrganizationServiceFactory.CreateOrganizationService(ExecutionContext.UserId);
            TracingService = serviceProvider.GetService<ITracingService>();            
        }

        public IPluginExecutionContext ExecutionContext
        {
            get;
            private set;
        }

        public IOrganizationService OrganizationService
        {
            get;
            private set;
        }

        public IOrganizationServiceFactory OrganizationServiceFactory
        {
            get;
            private set;
        }

        public IServiceProvider ServiceProvider
        {
            get;
            private set;
        }

        public ITracingService TracingService
        {
            get;
            private set;
        }

        public virtual void Trace(String message)
        {
            TracingService?.Trace(message);
        }
    }
}
