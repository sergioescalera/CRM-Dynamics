using Microsoft.Xrm.Sdk;
using System;
using System.Linq;

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

        public static OptionSetValueCollection ToOptionSetValueCollection<TEnum>(this TEnum[] values)
        {
            if (values == null || values.Empty())
                return null;

            var list = values
                .OfType<Enum>()
                .Select(o => o.ToOptionSetValue())
                .ToArray();

            return new OptionSetValueCollection(list);
        }
    }
}
