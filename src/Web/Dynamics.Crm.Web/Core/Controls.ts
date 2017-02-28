module Dynamics.Crm.Forms.Controls {

    "use strict";

    export function get(controlName: string, required: boolean = true): Control {

        var control = Xrm.Page.getControl(controlName);

        if (control) {
            return control;
        }

        var msg = "The specified control could not be found: " + controlName;

        if (required) {
            throw new Error(msg);
        }

        Diagnostics.log.Message(msg);

        return null;
    }

    // enable / disable

    export function disable(attributeNames: string[], all: boolean = true): void {

        setDisabled(attributeNames, true, all);
    }

    export function enable(attributeNames: string[], all: boolean = true): void {

        setDisabled(attributeNames, false, all);
    }

    export function setDisabled(attributeNames: string[], disabled: boolean, all: boolean): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("setDisabled", attributeNames, disabled);
        }

        if (Array.isArray(attributeNames)) {

            for (var i = 0; i < attributeNames.length; i++) {

                if (all) {

                    var attribute = Attributes.get(attributeNames[i], false);

                    if (attribute) {
                        attribute.controls.forEach((c: Control) => c.setDisabled(disabled));
                    }

                } else {

                    var control = get(attributeNames[i], false);

                    if (control) {
                        control.setDisabled(disabled);
                    }
                }
            }

        } else {

            console.warn("Controls.setDisabled: Invalid argument. An array was expected.");            
        }
    }

    // show / hide

    export function show(attributeNames: string[], condition: boolean = true): void {

        if (condition) {
            setVisible(attributeNames, true, true);
        }
    }

    export function hide(attributeNames: string[], condition: boolean = true): void {

        if (condition) {
            setVisible(attributeNames, false, true);
        }
    }

    function setVisible(attributeNames: string[], value: boolean, all: boolean) {

        Diagnostics.printArguments("setDisabled", attributeNames, value);

        if (Array.isArray(attributeNames)) {

            for (var i = 0; i < attributeNames.length; i++) {

                if (all) {
                    var attribute = Attributes.get(attributeNames[i], false);

                    if (attribute) {
                        attribute.controls.forEach((c: Control) => c.setVisible(value));
                    }
                } else {

                    var control = get(attributeNames[i], false);

                    if (control) {
                        control.setVisible(value);
                    }
                }
            }

        } else {

            console.warn("Invalid argument. An array was expected.");
            console.log(attributeNames);
        }
    }
}