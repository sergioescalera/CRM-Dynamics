var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var AutoNumberingRuleForm;
        (function (AutoNumberingRuleForm) {
            "use strict";
            // fields
            var _prefix;
            var _type;
            var _page;
            var _forms;
            // event handlers
            function OnLoad(context, prefix) {
                if (prefix === void 0) { prefix = "cc"; }
                _page = context.getFormContext();
                _prefix = prefix;
                _forms = new Crm.Forms(_page);
                _forms.tasks.execute([
                    function () { return Crm.Diagnostics.useLogEntryLogger(_prefix); },
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
                _type = _forms.attributes.get(_prefix + "_type");
                _type.addOnChange(OnTypeChanged);
            }
            function ConfigureGlobalSection() {
                var type = _type.getValue();
                var section = _forms.sections.get("tabGeneral", "sectionGlobal");
                var disabled = !isGlobal(type);
                section.controls.forEach(function (c) { return c.setDisabled(disabled); });
                if (disabled) {
                    section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                }
            }
            function ConfigureDailyConfigSection() {
                var type = _type.getValue();
                var section = _forms.sections.get("tabGeneral", "sectionDailyConfig");
                var disabled = !isDaily(type);
                section.controls.forEach(function (c) { return c.setDisabled(disabled); });
                if (disabled) {
                    section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                }
            }
            function ConfigureYearConfigSection() {
                var type = _type.getValue();
                var section = _forms.sections.get("tabGeneral", "sectionYearConfig");
                var disabled = !isYearly(type) && !isDaily(type);
                section.controls.forEach(function (c) { return c.setDisabled(disabled); });
                if (disabled) {
                    section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
                }
            }
            function ConfigureParentedSection() {
                var type = _type.getValue();
                var section = _forms.sections.get("tabGeneral", "sectionParented");
                var disabled = isGlobal(type);
                section.controls.forEach(function (c) { return c.setDisabled(disabled); });
                if (disabled) {
                    section.controls.forEach(function (c) { return c.getAttribute().setValue(null); });
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
