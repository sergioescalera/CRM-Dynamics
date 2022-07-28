var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        class Controls {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.attributes = new Crm.Attributes(page);
            }
            get(controlName, required = true) {
                let control = this.page.getControl(controlName);
                if (control) {
                    return control;
                }
                let msg = `The specified control could not be found: ${controlName}`;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            }
            // enable, disable
            disable(attributeNames, applyToAll = true) {
                this.setDisabled(attributeNames, true, applyToAll);
            }
            enable(attributeNames, applyToAll = true) {
                this.setDisabled(attributeNames, false, applyToAll);
            }
            setDisabled(attributeNames, disabled, applyToAll = true) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("setDisabled", attributeNames, disabled);
                }
                if (Array.isArray(attributeNames)) {
                    for (let i = 0; i < attributeNames.length; i++) {
                        if (applyToAll) {
                            let attribute = this.attributes.get(attributeNames[i], false);
                            if (attribute) {
                                attribute.controls.forEach((c) => c.setDisabled(disabled));
                            }
                        }
                        else {
                            let control = this.get(attributeNames[i], false);
                            if (control) {
                                control.setDisabled(disabled);
                            }
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Controls.setDisabled: Invalid argument. An array was expected.");
                }
            }
            // show, hide
            show(attributeNames, condition = true, applyToAll = true) {
                if (condition) {
                    this.setVisible(attributeNames, true, applyToAll);
                }
            }
            hide(attributeNames, condition = true, applyToAll = true) {
                if (condition) {
                    this.setVisible(attributeNames, false, applyToAll);
                }
            }
            setVisible(attributeNames, value, applyToAll = true) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("setVisible", attributeNames, value);
                }
                if (Array.isArray(attributeNames)) {
                    for (let i = 0; i < attributeNames.length; i++) {
                        let attribute = this.attributes.get(attributeNames[i], false);
                        if (applyToAll && attribute) {
                            attribute.controls.forEach((c) => c.setVisible(value));
                        }
                        else {
                            let control = this.get(attributeNames[i], false);
                            if (control) {
                                control.setVisible(value);
                            }
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Invalid argument. An array was expected.");
                }
            }
        }
        Crm.Controls = Controls;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
