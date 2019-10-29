module Dynamics.Crm.AutoNumberingRuleForm {

    "use strict";

    // fields

    let _prefix: string;
    let _type: Attribute;
    let _page: FormContext;
    let _forms: Forms;

    // event handlers

    export function OnLoad(context: ExecutionContext, prefix: string = "cc"): void {

        _page = context.getFormContext();
        _prefix = prefix;
        _forms = new Forms(_page);

        _forms.tasks.execute([
            () => Diagnostics.useLogEntryLogger(_prefix),
            Init,
            ConfigureGlobalSection,
            ConfigureDailyConfigSection,
            ConfigureYearConfigSection,
            ConfigureParentedSection
        ]);

        console.log("AutoNumberingRuleForm.OnLoad Completed");
    }

    function OnTypeChanged(): void {

        _forms.tasks.execute([
            ConfigureGlobalSection,
            ConfigureDailyConfigSection,
            ConfigureYearConfigSection,
            ConfigureParentedSection
        ]);
    }

    // tasks

    function Init(): void {

        _type = _forms.attributes.get(`${_prefix}_type`);

        _type.addOnChange(OnTypeChanged);
    }

    function ConfigureGlobalSection(): void {

        let type = _type.getValue();

        let section = _forms.sections.get("tabGeneral", "sectionGlobal");

        let disabled = !isGlobal(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureDailyConfigSection(): void {

        let type = _type.getValue();

        let section = _forms.sections.get("tabGeneral", "sectionDailyConfig");

        let disabled = !isDaily(type);

        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureYearConfigSection(): void {

        let type = _type.getValue();

        let section = _forms.sections.get("tabGeneral", "sectionYearConfig");

        let disabled = !isYearly(type) && !isDaily(type)
        
        section.controls.forEach((c: Control) => c.setDisabled(disabled));

        if (disabled) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureParentedSection(): void {

        let type = _type.getValue();

        let section = _forms.sections.get("tabGeneral", "sectionParented");

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