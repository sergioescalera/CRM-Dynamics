var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            (function (FormType) {
                FormType[FormType["Undefined"] = 0] = "Undefined";
                FormType[FormType["Create"] = 1] = "Create";
                FormType[FormType["Update"] = 2] = "Update";
                FormType[FormType["ReadOnly"] = 3] = "ReadOnly";
                FormType[FormType["Disabled"] = 4] = "Disabled";
                FormType[FormType["QuickCreate"] = 5] = "QuickCreate";
                FormType[FormType["BulkEdit"] = 6] = "BulkEdit";
                FormType[FormType["ReadOptimized"] = 11] = "ReadOptimized";
            })(Forms.FormType || (Forms.FormType = {}));
            var FormType = Forms.FormType;
            (function (FormFactor) {
                FormFactor[FormFactor["Unknown"] = 0] = "Unknown";
                FormFactor[FormFactor["Desktop"] = 1] = "Desktop";
                FormFactor[FormFactor["Tablet"] = 2] = "Tablet";
                FormFactor[FormFactor["Phone"] = 3] = "Phone";
            })(Forms.FormFactor || (Forms.FormFactor = {}));
            var FormFactor = Forms.FormFactor;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Core;
        (function (Core) {
            "use strict";
            (function (AutoNumberingRuleType) {
                AutoNumberingRuleType[AutoNumberingRuleType["Global"] = 0] = "Global";
                AutoNumberingRuleType[AutoNumberingRuleType["GlobalPerDay"] = 3] = "GlobalPerDay";
                AutoNumberingRuleType[AutoNumberingRuleType["GlobalPerYear"] = 1] = "GlobalPerYear";
                AutoNumberingRuleType[AutoNumberingRuleType["Parented"] = 2] = "Parented";
                AutoNumberingRuleType[AutoNumberingRuleType["ParentedPerDay"] = 5] = "ParentedPerDay";
                AutoNumberingRuleType[AutoNumberingRuleType["ParentedPerYear"] = 4] = "ParentedPerYear";
            })(Core.AutoNumberingRuleType || (Core.AutoNumberingRuleType = {}));
            var AutoNumberingRuleType = Core.AutoNumberingRuleType;
            (function (GlobalSettingType) {
                GlobalSettingType[GlobalSettingType["String"] = 0] = "String";
                GlobalSettingType[GlobalSettingType["Int"] = 1] = "Int";
                GlobalSettingType[GlobalSettingType["Decimal"] = 2] = "Decimal";
                GlobalSettingType[GlobalSettingType["Boolean"] = 3] = "Boolean";
                GlobalSettingType[GlobalSettingType["Reference"] = 4] = "Reference";
            })(Core.GlobalSettingType || (Core.GlobalSettingType = {}));
            var GlobalSettingType = Core.GlobalSettingType;
            (function (LogEntryType) {
                LogEntryType[LogEntryType["Trace"] = 0] = "Trace";
                LogEntryType[LogEntryType["Warning"] = 1] = "Warning";
                LogEntryType[LogEntryType["Error"] = 2] = "Error";
                LogEntryType[LogEntryType["Info"] = 3] = "Info";
            })(Core.LogEntryType || (Core.LogEntryType = {}));
            var LogEntryType = Core.LogEntryType;
        })(Core = Crm.Core || (Crm.Core = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
