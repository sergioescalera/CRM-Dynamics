using System;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PrimaryEntityAttribute : Attribute
    {
        public String SupportedEntity
        {
            get;
            private set;
        }

        public PrimaryEntityAttribute(String entityLogicalName)
        {
            this.EnsureNotNull(entityLogicalName);
            this.EnsureNotNullOrEmpty(entityLogicalName);

            SupportedEntity = entityLogicalName;
        }
    }    
}
