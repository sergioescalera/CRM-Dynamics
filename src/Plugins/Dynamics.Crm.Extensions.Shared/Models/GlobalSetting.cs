using Dynamics.Crm.Interfaces;
using System;
using static Dynamics.Crm.Data.Schema;

namespace Dynamics.Crm.Models
{
    public partial class GlobalSetting : IEntity
    {
        private readonly string _prefix;

        public GlobalSetting(String prefix)
        {
            this.EnsureNotNull(prefix, nameof(prefix));

            _prefix = prefix;
        }

        public Guid Id
        {
            get; set;
        }

        public String TypeName
        {
            get
            {
                return GlobalSettingEntity.TypeName(_prefix);
            }
        }

        public String Description
        {
            get; set;
        }

        public String Key
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public String Value
        {
            get; set;
        }

        public GlobalSettingType Type
        {
            get; set;
        }

        public String ReferenceType
        {
            get; set;
        }
    }
}
