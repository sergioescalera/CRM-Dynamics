module Dynamics.Crm {

    "use strict";

    export class Controls {

        protected page: FormContext;
        protected attributes: Attributes;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
            this.attributes = new Attributes(page);
        }

        get(controlName: string, required: boolean = true): Control {

            let control: Control = this.page.getControl(controlName);

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

        disable(attributeNames: string[], applyToAll: boolean = true): void {

            this.setDisabled(attributeNames, true, applyToAll);
        }

        enable(attributeNames: string[], applyToAll: boolean = true): void {

            this.setDisabled(attributeNames, false, applyToAll);
        }

        setDisabled(attributeNames: string[], disabled: boolean, applyToAll: boolean = true): void {

            if (Diagnostics.trace) {
                Diagnostics.printArguments("setDisabled", attributeNames, disabled);
            }

            if (Array.isArray(attributeNames)) {

                for (let i: number = 0; i < attributeNames.length; i++) {

                    if (applyToAll) {

                        let attribute: Attribute = this.attributes.get(attributeNames[i], false);

                        if (attribute) {
                            attribute.controls.forEach((c: Control) => c.setDisabled(disabled));
                        }

                    } else {

                        let control: Control = this.get(attributeNames[i], false);

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

        show(attributeNames: string[], condition: boolean = true, applyToAll: boolean = true): void {

            if (condition) {
                this.setVisible(attributeNames, true, applyToAll);
            }
        }

        hide(attributeNames: string[], condition: boolean = true, applyToAll: boolean = true): void {

            if (condition) {
                this.setVisible(attributeNames, false, applyToAll);
            }
        }

        setVisible(attributeNames: string[], value: boolean, applyToAll: boolean = true): void {

            if (Diagnostics.trace) {
                Diagnostics.printArguments("setVisible", attributeNames, value);
            }

            if (Array.isArray(attributeNames)) {

                for (let i: number = 0; i < attributeNames.length; i++) {

                    let attribute: Attribute = this.attributes.get(attributeNames[i], false);

                    if (applyToAll && attribute) {

                        attribute.controls.forEach((c: Control) => c.setVisible(value));

                    } else {

                        let control: Control = this.get(attributeNames[i], false);

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
}