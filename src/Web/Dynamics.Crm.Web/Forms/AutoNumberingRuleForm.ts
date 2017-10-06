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

        var isGlobal = type === Core.AutoNumberingRuleType.Global
            || type === Core.AutoNumberingRuleType.GlobalPerYear
            || type === Core.AutoNumberingRuleType.GlobalPerDay;

        section.controls.forEach((c: Control) => c.setDisabled(!isGlobal));

        if (!isGlobal) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureDailyConfigSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionDailyConfig");
        
        var isPerDay = type === Core.AutoNumberingRuleType.GlobalPerDay;

        section.controls.forEach((c: Control) => c.setDisabled(!isPerDay));

        if (!isPerDay) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureYearConfigSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionYearConfig");

        var isPerYear = type === Core.AutoNumberingRuleType.GlobalPerYear;
        var isPerDay = type === Core.AutoNumberingRuleType.GlobalPerDay;

        section.controls.forEach((c: Control) => c.setDisabled(!isPerYear && !isPerDay));

        if (!isPerYear && !isPerDay) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }

    function ConfigureParentedSection(): void {

        var type = _type.getValue();

        var section = Sections.get("tabGeneral", "sectionParented");

        var isParented = type === Core.AutoNumberingRuleType.Parented;

        section.controls.forEach((c: Control) => c.setDisabled(!isParented));

        if (!isParented) {

            section.controls.forEach((c: Control) => c.getAttribute().setValue(null));
        }
    }
}