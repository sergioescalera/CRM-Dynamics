module Dynamics.Crm.Forms.AutoNumberingRuleForm {

    "use strict";

    // fields

    let _prefix: string;
    let _type: Attribute;

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

        let type = _type.getValue();

        let section = Sections.get("tabGeneral", "sectionGlobal");

        let disabled = !isGlobal(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureDailyConfigSection(): void {

        let type = _type.getValue();

        let section = Sections.get("tabGeneral", "sectionDailyConfig");

        let disabled = !isDaily(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureYearConfigSection(): void {

        let type = _type.getValue();

        let section = Sections.get("tabGeneral", "sectionYearConfig");

        let disabled = !isYearly(type) && !isDaily(type)
        
        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureParentedSection(): void {

        let type = _type.getValue();

        let section = Sections.get("tabGeneral", "sectionParented");

        let disabled = isGlobal(type);

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