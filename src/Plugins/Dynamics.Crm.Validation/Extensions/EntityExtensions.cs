using System;

namespace Microsoft.Xrm.Sdk
{
    static class EntityExtensions
    {
        public static Boolean EnsureAttributeRequired(this Entity entity, String attributeName, Boolean ensureAttributePresent = true)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            if (attributeName == null)
                throw new ArgumentNullException(nameof(attributeName));

            if (!entity.Attributes.ContainsKey(attributeName))
                return !ensureAttributePresent;

            var value = entity.Attributes[attributeName];

            return value != null
                && (!(value is String) || value as String != String.Empty);
        }

        public static Boolean EnsureAttributeReadOnly(this Entity entity, Entity preImage, String attributeName, Boolean allowNullUpdate = true)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            if (preImage == null)
                throw new ArgumentNullException(nameof(preImage));

            if (attributeName == null)
                throw new ArgumentNullException(nameof(attributeName));

            if (!entity.Contains(attributeName))
                return true;

            var value = entity[attributeName];

            var previousValue = default(Object);

            if (preImage.Contains(attributeName))
                previousValue = preImage[attributeName];

            if (previousValue == null)
                return allowNullUpdate || value == null;

            if (value == null)
                return false;

            return AreEquals(value, previousValue);
        }

        private static bool AreEquals(object value1, object value2)
        {
            if (value1 == null && value2 == null) return true;

            if (value1 == null && value1 != null) return false;

            if (value1 != null && value1 == null) return false;

            if (value1.GetType() != value2.GetType()) return false;

            if (value1 is EntityReference)
                return ((EntityReference)value1).Id == ((EntityReference)value2).Id;

            if (value1 is Money)
                return ((Money)value1).Value == ((Money)value2).Value;

            return value1.Equals(value2);
        }
    }
}
