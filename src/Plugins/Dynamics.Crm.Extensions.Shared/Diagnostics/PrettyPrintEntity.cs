using Microsoft.Xrm.Sdk;
using System;
using System.Collections;
using System.Linq;
using System.Text;

namespace Dynamics.Crm.Diagnostics
{
    public static class PrettyPrintEntity
    {
        public static string ToJson(this IEnumerable entities)
        {
            return entities.ToJson(paddingLeft: 0);
        }
        
        public static string ToJson(this Entity entity)
        {
            return entity.ToJson(paddingLeft: 0);
        }

        public static string ToJson(this EntityCollection entities)
        {
            return entities.ToJson(paddingLeft: 0);
        }

        private static string ToJson(this IEnumerable entities, Int32 paddingLeft)
        {
            if (entities == null)
                return "<null>";

            var str = new StringBuilder("[".PadLeft(paddingLeft, ' '));

            str.AppendLine();

            foreach (var entity in entities)
            {
                str.AppendLine(DisplayValue(entity, paddingLeft + 3));
            }

            str.AppendLine("]".PadLeft(paddingLeft, ' '));

            return str.ToString();
        }

        private static string ToJson(this EntityCollection entities, Int32 paddingLeft)
        {
            if (entities == null)
                return "<null>";

            var str = new StringBuilder($"<{entities.EntityName}>[".PadLeft(paddingLeft, ' '));

            str.AppendLine();

            foreach (var entity in entities.Entities)
            {
                str.AppendLine(DisplayValue(entity, paddingLeft + 3));
            }

            str.AppendLine("]".PadLeft(paddingLeft, ' '));

            return str.ToString();
        }

        private static string ToJson(this Entity entity, Int32 paddingLeft)
        {
            if (entity == null)
                return "<null>";

            var str = new StringBuilder(String.Format("<Entity:{0}>", entity.LogicalName).PadLeft(paddingLeft, ' '));

            str.AppendLine("{");

            var padding = String.Empty.PadLeft(paddingLeft + 3, ' ');

            var attributeNames = entity.Attributes.Keys.OrderBy(a => a);

            foreach (var attributeName in attributeNames)
            {
                var value = entity[attributeName];

                var valueStr = DisplayValue(value, paddingLeft + 3);

                str.AppendLine($"{padding}{attributeName}: {valueStr},");                
            }

            str.AppendLine("}".PadLeft(paddingLeft, ' '));

            return str.ToString();
        }

        private static string DisplayValue(Object value, Int32 paddingLeft)
        {
            if (value == null)
                return "<null>";

            if (value is EntityReference reference)
            {
                return $"EntityReference<{reference.LogicalName}>({reference.Id}, {reference.Name})";
            }

            if (value is OptionSetValue optionSet)
            {
                return $"OptionSetValue({optionSet.Value})";
            }

            if (value is AliasedValue aliased)
            {
                return $"AliasedValue({DisplayValue(aliased.Value, paddingLeft)})";
            }

            if (value is Money money)
            {
                return $"Money({DisplayValue(money.Value, paddingLeft)})";
            }

            if (value is Entity entity)
            {
                return ToJson(entity, paddingLeft);
            }

            if (value is EntityCollection entities)
            {
                return ToJson(entities, paddingLeft);
            }

            return $"<{value.GetType().FullName}, {value.ToString()}>";
        }
    }
}
