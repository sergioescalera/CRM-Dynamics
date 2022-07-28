"use strict";
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var AutoNumberingRuleForm;
        (function (AutoNumberingRuleForm) {
            "use strict";
            // fields
            let _prefix;
            let _type;
            let _page;
            let _forms;
            // event handlers
            function OnLoad(context, prefix = "cc") {
                _page = context.getFormContext();
                _prefix = prefix;
                _forms = new Crm.Forms(_page);
                _forms.tasks.execute([
                    () => Crm.Diagnostics.useLogEntryLogger(_prefix),
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
                _forms.tasks.execute([
                    ConfigureGlobalSection,
                    ConfigureDailyConfigSection,
                    ConfigureYearConfigSection,
                    ConfigureParentedSection
                ]);
            }
            // tasks
            function Init() {
                _type = _forms.attributes.get(`${_prefix}_type`);
                _type.addOnChange(OnTypeChanged);
            }
            function ConfigureGlobalSection() {
                let type = _type.getValue();
                let section = _forms.sections.get("tabGeneral", "sectionGlobal");
                let disabled = !isGlobal(type);
                section.controls.forEach((c) => c.setDisabled(disabled));
                if (disabled) {
                    section.controls.forEach((c) => c.getAttribute().setValue(null));
                }
            }
            function ConfigureDailyConfigSection() {
                let type = _type.getValue();
                let section = _forms.sections.get("tabGeneral", "sectionDailyConfig");
                let disabled = !isDaily(type);
                section.controls.forEach((c) => c.setDisabled(disabled));
                if (disabled) {
                    section.controls.forEach((c) => c.getAttribute().setValue(null));
                }
            }
            function ConfigureYearConfigSection() {
                let type = _type.getValue();
                let section = _forms.sections.get("tabGeneral", "sectionYearConfig");
                let disabled = !isYearly(type) && !isDaily(type);
                section.controls.forEach((c) => c.setDisabled(disabled));
                if (disabled) {
                    section.controls.forEach((c) => c.getAttribute().setValue(null));
                }
            }
            function ConfigureParentedSection() {
                let type = _type.getValue();
                let section = _forms.sections.get("tabGeneral", "sectionParented");
                let disabled = isGlobal(type);
                section.controls.forEach((c) => c.setDisabled(disabled));
                if (disabled) {
                    section.controls.forEach((c) => c.getAttribute().setValue(null));
                }
            }
            function isGlobal(type) {
                return type === Crm.Core.AutoNumberingRuleType.Global
                    || type === Crm.Core.AutoNumberingRuleType.GlobalPerYear
                    || type === Crm.Core.AutoNumberingRuleType.GlobalPerDay;
            }
            function isDaily(type) {
                return type === Crm.Core.AutoNumberingRuleType.GlobalPerDay
                    || type === Crm.Core.AutoNumberingRuleType.ParentedPerDay;
            }
            function isYearly(type) {
                return type === Crm.Core.AutoNumberingRuleType.GlobalPerYear
                    || type === Crm.Core.AutoNumberingRuleType.ParentedPerYear;
            }
        })(AutoNumberingRuleForm = Crm.AutoNumberingRuleForm || (Crm.AutoNumberingRuleForm = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
