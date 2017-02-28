using System;

namespace Microsoft.Xrm.Sdk
{
    public static class EntityReferenceExtensions
    {
        public static EntityReference Clone(this EntityReference reference, Boolean ensureNotNull = false)
        {
            if (ensureNotNull)
                ValidationHelper.EnsureNotNull(reference);

            else if (reference == null)
                return null;

            return new EntityReference(reference.LogicalName, reference.Id);
        }
    }
}
