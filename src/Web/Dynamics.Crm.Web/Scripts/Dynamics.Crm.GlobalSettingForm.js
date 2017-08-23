var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var GlobalSettingForm;
            (function (GlobalSettingForm) {
                "use strict";
                // properties
                var _prefix;
                var _type;
                var _valueName;
                var _valueType;
                var _lookup;
                // event handlers
                function OnLoad(prefix) {
                    if (prefix === void 0) { prefix = "cc"; }
                    _prefix = prefix;
                    Dynamics.Crm.Tasks.execute([
                        Init,
                        SetReferenceFieldsVisibility
                    ]);
                }
                GlobalSettingForm.OnLoad = OnLoad;
                function OnTypeChanged() {
                    Crm.Tasks.execute([
                        ClearReferenceFields,
                        SetReferenceFieldsVisibility
                    ]);
                }
                // tasks
                function Init() {
                    _type = Forms.Attributes.get(_prefix + "_type");
                    _valueName = Forms.Attributes.get(_prefix + "_valuename");
                    _valueType = Forms.Attributes.get(_prefix + "_valuetype");
                    _lookup = Forms.Controls.get("WebResource_Lookup");
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
                        Forms.Attributes.setRecommended(fields);
                        Forms.Controls.show(fields);
                    }
                    else {
                        Forms.Attributes.setOptional(fields);
                        Forms.Controls.hide(fields);
                    }
                    _lookup.setVisible(visible);
                }
            })(GlobalSettingForm = Forms.GlobalSettingForm || (Forms.GlobalSettingForm = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));