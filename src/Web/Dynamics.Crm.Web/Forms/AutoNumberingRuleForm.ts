module Dynamics.Crm.Forms.AutoNumberingRuleForm {

    "use strict";

    // fields

    var _prefix: string;
    var _type: Attribute;

    // event handlers

    export function OnLoad(prefix: string = "cc"): void {

        _prefix = prefix;

        Tasks.execute([
            Init,
            ConfigureGlobalSection,
            ConfigureDailyConfigSection,
            ConfigureYearConfigSection,
            ConfigureParentedSection
        ]);

        console.log("AutoNumberingRuleForm.OnLoad Completed");
    }

    function OnTypeChanged(): void {

        Tasks.execute([
            ConfigureGlobalSection,
            ConfigureDailyConfigSection,
            ConfigureYearConfigSection,
            ConfigureParentedSection
        ]);
    }

    // tasks

    function Init(): void {

        _type = Attributes.get(`${_prefix}_type`);

        _type.addOnChange(OnTypeChanged);
    }

    function ConfigureGlobalSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionGlobal");

        var disabled = !isGlobal(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureDailyConfigSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionDailyConfig");

        var disabled = !isDaily(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureYearConfigSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionYearConfig");

        var disabled = !isYearly(type) && !isDaily(type)
        
        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureParentedSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionParented");

        var disabled = isGlobal(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function isGlobal(type: Core.AutoNumberingRuleType): boolean {

        return type === Core.AutoNumberingRuleType.Global
            || type === Core.AutoNumberingRuleType.GlobalPerYear
            || type === Core.AutoNumberingRuleType.GlobalPerDay;
    }
    
    function isDaily(type: Core.AutoNumberingRuleType): boolean {

        return type === Core.AutoNumberingRuleType.GlobalPerDay
            || type === Core.AutoNumberingRuleType.ParentedPerDay;
    }

    function isYearly(type: Core.AutoNumberingRuleType): boolean {

        return type === Core.AutoNumberingRuleType.GlobalPerYear
            || type === Core.AutoNumberingRuleType.ParentedPerYear;
    }
}