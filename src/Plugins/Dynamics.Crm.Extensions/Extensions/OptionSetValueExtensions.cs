using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions
{
    public static class OptionSetValueExtensions
    {
        public static TEnum? ToEnum<TEnum>(this OptionSetValue optionSet)
            where TEnum : struct
        {
            if (optionSet == null)
                return default(TEnum?);

            return (TEnum)Enum.ToObject(typeof(TEnum), optionSet.Value);
        }
    }
}
