module Dynamics.Crm.Forms.GlobalSettingForm {

    "use strict";

    // properties

    let _prefix: string;

    let _type: Attribute;
    let _valueName: Attribute;
    let _valueType: Attribute;
    let _lookup: Control;

    // event handlers

    export function OnLoad(prefix: string = "cc"): void {

        _prefix = prefix;

        Dynamics.Crm.Tasks.execute([
            Init,
            SetReferenceFieldsVisibility
        ]);
    }

    function OnTypeChanged(): void {

        Tasks.execute([
            ClearReferenceFields,
            SetReferenceFieldsVisibility
        ]);
    }

    // tasks

    function Init(): void {

        _type = Attributes.get(`${_prefix}_type`);
        _valueName = Attributes.get(`${_prefix}_valuename`);
        _valueType = Attributes.get(`${_prefix}_valuetype`);
        _lookup = Controls.get("WebResource_Lookup");

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
            Attributes.setRecommended(fields);
            Controls.show(fields);
        } else {
            Attributes.setOptional(fields);
            Controls.hide(fields);
        }

        _lookup.setVisible(visible);
    }
}