var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var Controls = /** @class */ (function () {
            function Controls(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.attributes = new Crm.Attributes(page);
            }
            Controls.prototype.get = function (controlName, required) {
                if (required === void 0) { required = true; }
                var control = this.page.getControl(controlName);
                if (control) {
                    return control;
                }
                var msg = "The specified control could not be found: " + controlName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            };
            // enable, disable
            Controls.prototype.disable = function (attributeNames, applyToAll) {
                if (applyToAll === void 0) { applyToAll = true; }
                this.setDisabled(attributeNames, true, applyToAll);
            };
            Controls.prototype.enable = function (attributeNames, applyToAll) {
                if (applyToAll === void 0) { applyToAll = true; }
                this.setDisabled(attributeNames, false, applyToAll);
            };
            Controls.prototype.setDisabled = function (attributeNames, disabled, applyToAll) {
                if (applyToAll === void 0) { applyToAll = true; }
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("setDisabled", attributeNames, disabled);
                }
                if (Array.isArray(attributeNames)) {
                    for (var i = 0; i < attributeNames.length; i++) {
                        if (applyToAll) {
                            var attribute = this.attributes.get(attributeNames[i], false);
                            if (attribute) {
                                attribute.controls.forEach(function (c) { return c.setDisabled(disabled); });
                            }
                        }
                        else {
                            var control = this.get(attributeNames[i], false);
                            if (control) {
                                control.setDisabled(disabled);
                            }
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Controls.setDisabled: Invalid argument. An array was expected.");
                }
            };
            // show, hide
            Controls.prototype.show = function (attributeNames, condition, applyToAll) {
                if (condition === void 0) { condition = true; }
                if (applyToAll === void 0) { applyToAll = true; }
                if (condition) {
                    this.setVisible(attributeNames, true, applyToAll);
                }
            };
            Controls.prototype.hide = function (attributeNames, condition, applyToAll) {
                if (condition === void 0) { condition = true; }
                if (applyToAll === void 0) { applyToAll = true; }
                if (condition) {
                    this.setVisible(attributeNames, false, applyToAll);
                }
            };
            Controls.prototype.setVisible = function (attributeNames, value, applyToAll) {
                if (applyToAll === void 0) { applyToAll = true; }
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("setVisible", attributeNames, value);
                }
                if (Array.isArray(attributeNames)) {
                    for (var i = 0; i < attributeNames.length; i++) {
                        var attribute = this.attributes.get(attributeNames[i], false);
                        if (applyToAll && attribute) {
                            attribute.controls.forEach(function (c) { return c.setVisible(value); });
                        }
                        else {
                            var control = this.get(attributeNames[i], false);
                            if (control) {
                                control.setVisible(value);
                            }
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Invalid argument. An array was expected.");
                }
            };
            return Controls;
        }());
        Crm.Controls = Controls;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
