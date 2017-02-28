using System;

namespace Dynamics.Crm.Validation.Plugins
{
    class Helper
    {
        public static Tuple<String, String> GetAttributeNameAndLabel(String attribute)
        {
            if (String.IsNullOrWhiteSpace(attribute))
                Tuple.Create(String.Empty, String.Empty);

            var index = attribute.IndexOf(',');

            if (index < 0)
                return GetAttributeNameAndLabel(attribute, attribute);

            return GetAttributeNameAndLabel(attribute.Substring(0, index), attribute.Substring(index + 1));
        }

        private static Tuple<String, String> GetAttributeNameAndLabel(String name, String displayName)
        {
            return Tuple.Create((name ?? String.Empty).Trim(), (displayName ?? String.Empty).Trim());
        }
    }
}
