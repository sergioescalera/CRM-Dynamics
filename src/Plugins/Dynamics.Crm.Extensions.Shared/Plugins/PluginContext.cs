using Dynamics.Crm.Interfaces;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;

namespace Dynamics.Crm.Plugins
{
    public class PluginContext : IPluginContext, IDisposable
    {
        private Boolean _disposed = false;

        public PluginContext(IServiceProvider serviceProvider)
        {
            this.EnsureNotNull(serviceProvider);

            ServiceProvider = serviceProvider;

            ExecutionContext = serviceProvider.GetService<IPluginExecutionContext>();
            OrganizationServiceFactory = serviceProvider.GetService<IOrganizationServiceFactory>();
            OrganizationService = OrganizationServiceFactory.CreateOrganizationService(ExecutionContext.UserId);
            TracingService = new Diagnostics.TracingServiceWrapper(serviceProvider.GetService<ITracingService>());

            OrganizationServiceContext = new Lazy<OrganizationServiceContext>(() =>
                {
                    if (_disposed)
                        throw new ObjectDisposedException(nameof(OrganizationServiceContext));

                    return new OrganizationServiceContext(OrganizationService);
                });
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

        public Lazy<OrganizationServiceContext> OrganizationServiceContext
        {
            get;
            private set;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        
        ~PluginContext()
        {            
            Dispose(false);
        }
        
        protected virtual void Dispose(bool disposing)
        {
            if (disposing && OrganizationServiceContext.IsValueCreated && !_disposed)            
                OrganizationServiceContext.Value.Dispose();                
            
            if (!_disposed)
                _disposed = true;
        }
    }
}
