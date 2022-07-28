"use strict";
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var GlobalSettingForm;
        (function (GlobalSettingForm) {
            "use strict";
            // properties
            let _prefix;
            let _page;
            let _forms;
            let _type;
            let _valueName;
            let _valueType;
            let _lookup;
            // event handlers
            function OnLoad(context, prefix = "cc") {
                _page = context.getFormContext();
                _prefix = prefix;
                _forms = new Crm.Forms(_page);
                _forms.tasks.execute([
                    () => Crm.Diagnostics.useLogEntryLogger(_prefix),
                    Init,
                    SetReferenceFieldsVisibility
                ]);
            }
            GlobalSettingForm.OnLoad = OnLoad;
            function OnTypeChanged() {
                _forms.tasks.execute([
                    ClearReferenceFields,
                    SetReferenceFieldsVisibility
                ]);
            }
            // tasks
            function Init() {
                _type = _forms.attributes.get(`${_prefix}_type`);
                _valueName = _forms.attributes.get(`${_prefix}_valuename`);
                _valueType = _forms.attributes.get(`${_prefix}_valuetype`);
                _lookup = _forms.controls.get("WebResource_Lookup");
                _type.addOnChange(OnTypeChanged);
            }
            function ClearReferenceFields() {
                if (_type.getValue() === Crm.Core.GlobalSettingType.Reference) {
                    return;
                }
                _valueName.setValue(null);
                _valueType.setValue(null);
            }
            function SetReferenceFieldsVisibility() {
                let visible = _type.getValue() === Crm.Core.GlobalSettingType.Reference;
                let fields = [
                    _valueName.getName(),
                    _valueType.getName()
                ];
                if (visible) {
                    _forms.attributes.setRecommended(fields);
                    _forms.controls.show(fields);
                }
                else {
                    _forms.attributes.setOptional(fields);
                    _forms.controls.hide(fields);
                }
                _lookup.setVisible(visible);
            }
        })(GlobalSettingForm = Crm.GlobalSettingForm || (Crm.GlobalSettingForm = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
