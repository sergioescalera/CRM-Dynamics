using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Interfaces
{
    public interface IPluginContext
    {
        IPluginExecutionContext ExecutionContext { get; }

        IOrganizationService OrganizationService { get; }

        IOrganizationServiceFactory OrganizationServiceFactory { get; }

        IServiceProvider ServiceProvider { get; }

        ITracingService TracingService { get; }
    }
}
