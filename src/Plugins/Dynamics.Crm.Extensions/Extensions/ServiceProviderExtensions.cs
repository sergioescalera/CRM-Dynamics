using System;

namespace Microsoft.Xrm.Sdk
{
    public static class ServiceProviderExtensions
    {
        public static TService GetService<TService>(this IServiceProvider serviceProvider, Boolean ensureNotNull = true)
        {
            ValidationHelper.EnsureNotNull(serviceProvider);
            
            var service = serviceProvider.GetService(typeof(TService));

            if (service == null && ensureNotNull)
                throw new InvalidPluginExecutionException($"Unable to resolve {typeof(TService).FullName} service.");

            return (TService)service;
        }
    }
}
