module Dynamics.Crm.Forms.GlobalSettingForm {

    "use strict";

    // properties

    var _prefix: string;

    var _type: Attribute;
    var _valueName: Attribute;
    var _valueType: Attribute;
    var _lookup: Control;

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

        var visible = _type.getValue() === Core.GlobalSettingType.Reference;

        var fields = [
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