module Dynamics.Crm.Forms.Controls {

    "use strict";

    export function get(controlName: string, required: boolean = true): Control {

        let control: Control = Xrm.Page.getControl(controlName);

        if (control) {
            return control;
        }

        let msg: string = `The specified control could not be found: ${controlName}`;

        if (required) {
            throw new Error(msg);
        }

        Diagnostics.log.Message(msg);

        return null;
    }

    // enable, disable

    export function disable(attributeNames: string[], applyToAll: boolean = true): void {

        setDisabled(attributeNames, true, applyToAll);
    }

    export function enable(attributeNames: string[], applyToAll: boolean = true): void {

        setDisabled(attributeNames, false, applyToAll);
    }

    export function setDisabled(attributeNames: string[], disabled: boolean, applyToAll: boolean = true): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("setDisabled", attributeNames, disabled);
        }

        if (Array.isArray(attributeNames)) {

            for (let i: number = 0; i < attributeNames.length; i++) {

                if (applyToAll) {

                    let attribute: Attribute = Attributes.get(attributeNames[i], false);

                    if (attribute) {
                        attribute.controls.forEach((c: Control) => c.setDisabled(disabled));
                    }

                } else {

                    let control: Control = get(attributeNames[i], false);

                    if (control) {
                        control.setDisabled(disabled);
                    }
                }
            }

        } else {

            Diagnostics.log.Warning("Controls.setDisabled: Invalid argument. An array was expected.");
        }
    }

    // show, hide

    export function show(attributeNames: string[], condition: boolean = true, applyToAll: boolean = true): void {

        if (condition) {
            setVisible(attributeNames, true, applyToAll);
        }
    }

    export function hide(attributeNames: string[], condition: boolean = true, applyToAll: boolean = true): void {

        if (condition) {
            setVisible(attributeNames, false, applyToAll);
        }
    }

    export function setVisible(attributeNames: string[], value: boolean, applyToAll: boolean = true): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("setVisible", attributeNames, value);
        }

        if (Array.isArray(attributeNames)) {

            for (let i: number = 0; i < attributeNames.length; i++) {

                let attribute: Attribute = Attributes.get(attributeNames[i], false);

                if (applyToAll && attribute) {

                    attribute.controls.forEach((c: Control) => c.setVisible(value));

                } else {

                    let control: Control = get(attributeNames[i], false);

                    if (control) {
                        control.setVisible(value);
                    }
                }
            }

        } else {

            Diagnostics.log.Warning("Invalid argument. An array was expected.");
        }
    }
}