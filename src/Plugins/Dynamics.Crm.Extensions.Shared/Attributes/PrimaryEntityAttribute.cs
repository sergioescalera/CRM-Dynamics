using System;

namespace Dynamics.Crm.Attributes
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class PrimaryEntityAttribute : Attribute
    {
        public String EntityLogicalName
        {
            get;
            private set;
        }

        public PrimaryEntityAttribute(String entityLogicalName)
        {
            this.EnsureNotNull(entityLogicalName);
            this.EnsureNotNullOrEmpty(entityLogicalName);

            EntityLogicalName = entityLogicalName;
        }
    }    
}
