module Dynamics.Crm.Forms.Controls {

    "use strict";

    export function get(controlName: string, required: boolean = true): Control {

        var control: Control = Xrm.Page.getControl(controlName);

        if (control) {
            return control;
        }

        var msg: string = `The specified control could not be found: ${controlName}`;

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

            for (var i: number = 0; i < attributeNames.length; i++) {

                if (applyToAll) {

                    var attribute: Attribute = Attributes.get(attributeNames[i], false);

                    if (attribute) {
                        attribute.controls.forEach((c: Control) => c.setDisabled(disabled));
                    }

                } else {

                    var control: Control = get(attributeNames[i], false);

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

            for (var i: number = 0; i < attributeNames.length; i++) {

                var attribute: Attribute = Attributes.get(attributeNames[i], false);

                if (applyToAll && attribute) {

                    attribute.controls.forEach((c: Control) => c.setVisible(value));

                } else {

                    var control: Control = get(attributeNames[i], false);

                    if (control) {
                        control.setVisible(value);
                    }
                }
            }

        } else {

            Diagnostics.log.Warning("Invalid argument. An array was expected.");
        }
    }

    // auto-complete

    export function autoComplete(
        controlName: string,
        query: (input: any) => JQueryPromise<any[]>,
        commands: AutoCompleteCommand = null,
        required: boolean = true): void {

        var control: Control = get(controlName, required);

        if (!control) {
            return;
        }

        control.addOnKeyPress(() => {

            var input: any = control.getValue();

            query(input)
                .then((results: any[]) => {

                    if (results || results.length > 0) {

                        control.showAutoComplete({
                            results: results
                                .filter((o: any) => !!o)
                                .map((o: any, i: number) => {
                                    return {
                                        id: o.id || i,
                                        icon: o.icon,
                                        fields: o.fields || [o.value || o]
                                    };
                                }),
                            commands: commands
                        });

                    } else {

                        control.hideAutoComplete();
                    }
                });
        });
    }
}