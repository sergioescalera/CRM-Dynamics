var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var AutoNumberingRuleForm;
            (function (AutoNumberingRuleForm) {
                "use strict";
                // fields
                var _prefix;
                var _type;
                // event handlers
                function OnLoad(prefix) {
                    if (prefix === void 0) { prefix = "cc"; }
                    _prefix = prefix;
                    Crm.Tasks.execute([
                        Init,
                        ConfigureGlobalSection,
                        ConfigureDailyConfigSection,
                        ConfigureYearConfigSection,
                        ConfigureParentedSection
                    ]);
                    console.log("AutoNumberingRuleForm.OnLoad Completed");
                }
                AutoNumberingRuleForm.OnLoad = OnLoad;
                function OnTypeChanged() {
                    Crm.Tasks.execute([
                        ConfigureGlobalSection,
                        ConfigureDailyConfigSection,
                        ConfigureYearConfigSection,
                        ConfigureParentedSection
                    ]);
                }
                // tasks
                function Init() {
                    _type = Forms.Attributes.get(_prefix + "_type");
                    _type.addOnChange(OnTypeChanged);
                }
                function ConfigureGlobalSection() {
                    var type = _type.getValue();
                    var section = Forms.Sections.get("tabGeneral", "sectionGlobal");
                    var isGlobal = type === Crm.Core.AutoNumberingRuleType.Global
                        || type === Crm.Core.AutoNumberingRuleType.GlobalPerYear
                        || type === Crm.Core.AutoNumberingRuleType.GlobalPerDay;
                    section.controls.forEach(function (c) { return c.setDisabled(!isGlobal); });
                    if (!isGlobal) {
                        section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                    }
                }
                function ConfigureDailyConfigSection() {
                    var type = _type.getValue();
                    var section = Forms.Sections.get("tabGeneral", "sectionDailyConfig");
                    var isPerDay = type === Crm.Core.AutoNumberingRuleType.GlobalPerDay;
                    section.controls.forEach(function (c) { return c.setDisabled(!isPerDay); });
                    if (!isPerDay) {
                        section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                    }
                }
                function ConfigureYearConfigSection() {
                    var type = _type.getValue();
                    var section = Forms.Sections.get("tabGeneral", "sectionYearConfig");
                    var isPerYear = type === Crm.Core.AutoNumberingRuleType.GlobalPerYear;
                    var isPerDay = type === Crm.Core.AutoNumberingRuleType.GlobalPerDay;
                    section.controls.forEach(function (c) { return c.setDisabled(!isPerYear && !isPerDay); });
                    if (!isPerYear && !isPerDay) {
                        section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                    }
                }
                function ConfigureParentedSection() {
                    var type = _type.getValue();
                    var section = Forms.Sections.get("tabGeneral", "sectionParented");
                    var isParented = type === Crm.Core.AutoNumberingRuleType.Parented;
                    section.controls.forEach(function (c) { return c.setDisabled(!isParented); });
                    if (!isParented) {
                        section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                    }
                }
            })(AutoNumberingRuleForm = Forms.AutoNumberingRuleForm || (Forms.AutoNumberingRuleForm = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));