using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions
{
    public static class EnumExtensions
    {
        public static OptionSetValue ToOptionSetValue(this Enum value)
        {
            if (value == null)
                return null;

            return new OptionSetValue(Convert.ToInt32(value));
        }
    }
}
