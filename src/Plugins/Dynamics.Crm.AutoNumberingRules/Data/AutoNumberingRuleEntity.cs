using System;

namespace Dynamics.Crm.Data
{
    static class AutoNumberingRuleEntity
    {
        public static readonly Func<String, String> TypeName = (prefix) => $"{prefix}_autonumberingrule";

        public static readonly Func<String, String> IdFieldName = (prefix) => $"{prefix}_autonumberingruleid";

        public static readonly Func<String, String> AttributeNameFieldName = (prefix) => $"{prefix}_attributename";

        public static readonly Func<String, String> ConcurrencyTokenFieldName = (prefix) => $"{prefix}_concurrencytoken";

        public static readonly Func<String, String> EntityNameFieldName = (prefix) => $"{prefix}_entityname";

        public static readonly Func<String, String> FormatFieldName = (prefix) => $"{prefix}_format";

        public static readonly Func<String, String> TypeFieldName = (prefix) => $"{prefix}_type";

        public static readonly Func<String, String> LastNumberFieldName = (prefix) => $"{prefix}_lastnumber";

        public static readonly Func<String, String> LastNumberAttributeNameFieldName = (prefix) => $"{prefix}_lastnumberattributename";
        public static readonly Func<String, String> LengthFieldName = (prefix) => $"{prefix}_length";

        public static readonly Func<String, String> ParentAttributeNameFieldName = (prefix) => $"{prefix}_parentattributename";

        public static readonly Func<String, String> ParentAttributeListFieldName = (prefix) => $"{prefix}_parentattributelist";

        public static readonly Func<String, String> UsesFourDigitsYearFieldName = (prefix) => $"{prefix}_usesfourdigitsyear";

        public static readonly Func<String, String> LastDayFieldName = (prefix) => $"{prefix}_lastday";

        public static readonly Func<String, String> LastYearFieldName = (prefix) => $"{prefix}_lastyear";
    }
}
