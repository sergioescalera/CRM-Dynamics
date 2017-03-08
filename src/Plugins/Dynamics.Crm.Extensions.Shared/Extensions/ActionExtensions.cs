using System;

namespace Dynamics.Crm.Extensions
{
    public static class ActionExtensions
    {
        public static void Catch(this Action action, Action<Exception> @catch = null)
        {
            ValidationHelper.EnsureNotNull(action);

            try
            {
                action();
            }
            catch (Exception ex)
            {
                if (@catch != null)
                {
                    @catch(ex);
                }
            }
        }
    }
}
