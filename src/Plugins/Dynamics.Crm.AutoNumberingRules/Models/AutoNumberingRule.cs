using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using System;

namespace Dynamics.Crm.Models
{
    public class AutoNumberingRule : IEntity
    {
        private readonly string _prefix;

        public AutoNumberingRule(String prefix)
        {
            this.EnsureNotNull(prefix, nameof(prefix));

            _prefix = prefix;
        }

        public Guid Id
        {
            get;
            set;
        }

        public String TypeName
        {
            get
            {
                return AutoNumberingRuleEntity.TypeName(_prefix);
            }
        }

        public String AttributeName
        {
            get; set;
        }

        public String ConcurrencyToken
        {
            get; set;
        }

        public String EntityName
        {
            get; set;
        }

        public String Format
        {
            get; set;
        }

        public AutoNumberingRuleType Type
        {
            get; set;
        }

        public String LastNumberAttributeName
        {
            get; set;
        }

        public String LastYearAttributeName
        {
            get; set;
        }

        public String LastDayAttributeName
        {
            get; set;
        }

        public Int32? Length
        {
            get; set;
        }

        public String Name
        {
            get; set;
        }

        public String ParentAttributeName
        {
            get; set;
        }

        public String[] ParentAttributes
        {
            get; set;
        }

        public Boolean UsesFourDigitsYear
        {
            get; set;
        }

        public Boolean IsGlobal()
        {
            return Type == AutoNumberingRuleType.Global
                || Type == AutoNumberingRuleType.GlobalPerDay
                || Type == AutoNumberingRuleType.GlobalPerYear;
        }

        public Boolean IsParented()
        {
            return Type == AutoNumberingRuleType.Parented
                || Type == AutoNumberingRuleType.ParentedPerDay
                || Type == AutoNumberingRuleType.ParentedPerYear;
        }
        
        public Boolean IsDaily()
        {
            return Type == AutoNumberingRuleType.GlobalPerDay
                || Type == AutoNumberingRuleType.ParentedPerDay;
        }

        public Boolean IsYearly()
        {
            return Type == AutoNumberingRuleType.GlobalPerYear
                || Type == AutoNumberingRuleType.ParentedPerYear;
        }
    }
}
