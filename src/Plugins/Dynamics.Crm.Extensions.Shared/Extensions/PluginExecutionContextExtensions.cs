using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions
{
    static class PluginExecutionContextExtensions
    {
        public static void Track(this IPluginExecutionContext context, String tokenName, Object tokenValue = null)
        {
            ValidationHelper.EnsureNotNull(context);
            ValidationHelper.EnsureNotNull(tokenName);

            tokenValue = tokenValue ?? true;

            context.SharedVariables.Add(tokenName, tokenValue);
        }

        public static Boolean IsTracking(this IPluginExecutionContext context, String tokenName, Object tokenValue = null)
        {
            ValidationHelper.EnsureNotNull(context);
            ValidationHelper.EnsureNotNull(tokenName);

            tokenValue = tokenValue ?? true;

            var found = context.FindToken(tokenName);

            return found?.Equals(tokenValue) ?? false;
        }

        private static Object FindToken(this IPluginExecutionContext context, String tokenName)
        {
            if (context == null)
                return null;

            var tokenValue = default(Object);

            if (context.SharedVariables.TryGetValue(tokenName, out tokenValue))
            {
                return tokenValue;
            }

            return context.ParentContext.FindToken(tokenName);
        }

        public static Int32 PrintSharedVariables(this IPluginExecutionContext context, ITracingService trace)
        {
            if (context == null)
                return 0;

            var padding = context.ParentContext.PrintSharedVariables(trace);

            var prefix = String.Empty.PadLeft(padding, '-');

            trace.Trace($"Level {padding}");

            foreach (var key in context.SharedVariables.Keys)
            {
                var value = PrintValue(context.SharedVariables[key]);

                trace.Trace($"{prefix}{key}:{value}");
            }

            return ++padding;
        }

        public static IPluginExecutionContext Top(this IPluginExecutionContext context)
        {
            if (context == null)
                return null;

            if (context.ParentContext == null)
                return context;

            return context.ParentContext.Top();
        }

        private static String PrintValue(object value)
        {
            if (value == null)
                return "[null]";

            return value.ToString();
        }
    }
}