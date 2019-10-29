var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var GlobalSettingForm;
        (function (GlobalSettingForm) {
            "use strict";
            // properties
            var _prefix;
            var _page;
            var _forms;
            var _type;
            var _valueName;
            var _valueType;
            var _lookup;
            // event handlers
            function OnLoad(page, prefix) {
                if (prefix === void 0) { prefix = "cc"; }
                _page = page;
                _prefix = prefix;
                _forms = new Crm.Forms(page);
                _forms.tasks.execute([
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
                _type = _forms.attributes.get(_prefix + "_type");
                _valueName = _forms.attributes.get(_prefix + "_valuename");
                _valueType = _forms.attributes.get(_prefix + "_valuetype");
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
                var visible = _type.getValue() === Crm.Core.GlobalSettingType.Reference;
                var fields = [
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
