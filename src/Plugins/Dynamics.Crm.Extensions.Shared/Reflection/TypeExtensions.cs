using System;
using System.Collections.Generic;
using System.Text;

namespace Dynamics.Crm.Reflection
{
    public static class TypeExtensions
    {
        public static TAttribute GetCustomAttribute<TAttribute>(this Type pluginType)
            where TAttribute : Attribute
        {
            return (TAttribute)Attribute.GetCustomAttribute(pluginType, typeof(TAttribute));
        }
    }
}
