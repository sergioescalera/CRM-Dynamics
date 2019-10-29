module Dynamics.Crm.GlobalSettingForm {

    "use strict";

    // properties

    let _prefix: string;
    let _page: FormContext;
    let _forms: Forms;

    let _type: Attribute;
    let _valueName: Attribute;
    let _valueType: Attribute;
    let _lookup: Control;

    // event handlers

    export function OnLoad(context: ExecutionContext, prefix: string = "cc"): void {

        _page = context.getFormContext();
        _prefix = prefix;
        _forms = new Forms(_page);

        _forms.tasks.execute([
            () => Diagnostics.useLogEntryLogger(_prefix),
            Init,
            SetReferenceFieldsVisibility
        ]);
    }

    function OnTypeChanged(): void {

        _forms.tasks.execute([
            ClearReferenceFields,
            SetReferenceFieldsVisibility
        ]);
    }

    // tasks

    function Init(): void {

        _type = _forms.attributes.get(`${_prefix}_type`);
        _valueName = _forms.attributes.get(`${_prefix}_valuename`);
        _valueType = _forms.attributes.get(`${_prefix}_valuetype`);
        _lookup = _forms.controls.get("WebResource_Lookup");

        _type.addOnChange(OnTypeChanged);
    }

    function ClearReferenceFields(): void {

        if (_type.getValue() === Core.GlobalSettingType.Reference) {

            return;
        }

        _valueName.setValue(null);
        _valueType.setValue(null);
    }

    function SetReferenceFieldsVisibility(): void {

        let visible = _type.getValue() === Core.GlobalSettingType.Reference;

        let fields = [
            _valueName.getName(),
            _valueType.getName()
        ];

        if (visible) {
            _forms.attributes.setRecommended(fields);
            _forms.controls.show(fields);
        } else {
            _forms.attributes.setOptional(fields);
            _forms.controls.hide(fields);
        }

        _lookup.setVisible(visible);
    }
}