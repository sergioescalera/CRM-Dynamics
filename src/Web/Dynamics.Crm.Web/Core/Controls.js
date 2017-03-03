var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Controls;
            (function (Controls) {
                "use strict";
                function get(controlName, required) {
                    if (required === void 0) { required = true; }
                    var control = Xrm.Page.getControl(controlName);
                    if (control) {
                        return control;
                    }
                    var msg = "The specified control could not be found: " + controlName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Controls.get = get;
                // enable / disable
                function disable(attributeNames, applyToAll) {
                    if (applyToAll === void 0) { applyToAll = true; }
                    setDisabled(attributeNames, true, applyToAll);
                }
                Controls.disable = disable;
                function enable(attributeNames, applyToAll) {
                    if (applyToAll === void 0) { applyToAll = true; }
                    setDisabled(attributeNames, false, applyToAll);
                }
                Controls.enable = enable;
                function setDisabled(attributeNames, disabled, applyToAll) {
                    if (applyToAll === void 0) { applyToAll = true; }
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("setDisabled", attributeNames, disabled);
                    }
                    if (Array.isArray(attributeNames)) {
                        for (var i = 0; i < attributeNames.length; i++) {
                            if (applyToAll) {
                                var attribute = Forms.Attributes.get(attributeNames[i], false);
                                if (attribute) {
                                    attribute.controls.forEach(function (c) { return c.setDisabled(disabled); });
                                }
                            }
                            else {
                                var control = get(attributeNames[i], false);
                                if (control) {
                                    control.setDisabled(disabled);
                                }
                            }
                        }
                    }
                    else {
                        console.warn("Controls.setDisabled: Invalid argument. An array was expected.");
                    }
                }
                Controls.setDisabled = setDisabled;
                // show / hide
                function show(attributeNames, condition, applyToAll) {
                    if (condition === void 0) { condition = true; }
                    if (applyToAll === void 0) { applyToAll = true; }
                    if (condition) {
                        setVisible(attributeNames, true, applyToAll);
                    }
                }
                Controls.show = show;
                function hide(attributeNames, condition, applyToAll) {
                    if (condition === void 0) { condition = true; }
                    if (applyToAll === void 0) { applyToAll = true; }
                    if (condition) {
                        setVisible(attributeNames, false, applyToAll);
                    }
                }
                Controls.hide = hide;
                function setVisible(attributeNames, value, applyToAll) {
                    if (applyToAll === void 0) { applyToAll = true; }
                    Crm.Diagnostics.printArguments("setVisible", attributeNames, value);
                    if (Array.isArray(attributeNames)) {
                        for (var i = 0; i < attributeNames.length; i++) {
                            var attribute = Forms.Attributes.get(attributeNames[i], false);
                            if (applyToAll && attribute) {
                                attribute.controls.forEach(function (c) { return c.setVisible(value); });
                            }
                            else {
                                var control = get(attributeNames[i], false);
                                if (control) {
                                    control.setVisible(value);
                                }
                            }
                        }
                    }
                    else {
                        console.warn("Invalid argument. An array was expected.");
                        console.log(attributeNames);
                    }
                }
                Controls.setVisible = setVisible;
            })(Controls = Forms.Controls || (Forms.Controls = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
