module Dynamics.Crm {

    "use strict";

    export class Attributes {

        protected page: FormContext;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
        }

        get(attributeName: string, required: boolean = true): Attribute {

            let attribute = this.page.getAttribute(attributeName);

            if (attribute) {
                return attribute;
            }

            let msg = "The specified attribute could not be found: " + attributeName;

            if (required) {
                throw new Error(msg);
            }

            Diagnostics.log.Message(msg);

            return null;
        }

        // requirement level

        setOptional(attributeNames: string[]): void {

            this.setRequiredLevel(attributeNames, AttributeRequiredLevels.None);
        }

        setRequired(attributeNames: string[]): void {

            this.setRequiredLevel(attributeNames, AttributeRequiredLevels.Required);
        }

        setRecommended(attributeNames: string[]): void {

            this.setRequiredLevel(attributeNames, AttributeRequiredLevels.Recommended);
        }

        setRequiredLevel(attributeNames: string[], requirementLevel: AttributeRequiredLevel): void {

            if (Diagnostics.trace) {
                Diagnostics.printArguments("setRequirementLevel", attributeNames, requirementLevel);
            }

            if (Array.isArray(attributeNames)) {

                for (let i = 0; i < attributeNames.length; i++) {

                    let attribute = this.get(attributeNames[i], false);

                    if (attribute) {
                        attribute.setRequiredLevel(requirementLevel);
                    }
                }

            } else {

                Diagnostics.log.Warning("Attributes.setRequirementLevel: Invalid argument. An array was expected.");
            }
        }

        setRequiredOrOptional(attributeName: string, required: boolean, attributeRequired: boolean = false): void {

            let attribute = this.get(attributeName, attributeRequired);

            if (attribute) {
                attribute.setRequiredLevel(required ? AttributeRequiredLevels.Required : AttributeRequiredLevels.None);
            }
        }

        // options

        hideOptions(attribute: Attribute, hide?: (o: number) => boolean): void {

            let options = attribute.getOptions();

            attribute
                .controls
                .forEach((control: Control) => {

                    for (let i = 0; i < options.length; i++) {

                        let option = options[i];

                        let value = option.value;

                        if (hide === undefined || hide(value)) {

                            control.removeOption(value);
                        }
                    }
                });
        }

        // lookup

        getLookupValue(attributeName: string, required: boolean = true): LookupControlItem {

            let attribute = this.get(attributeName, required);

            if (!attribute) {

                return null;
            }

            let lookup = <any[]>attribute.getValue();

            if (!lookup || !lookup.length) {

                return null;
            }

            return lookup[0];
        }

        setLookupValue(
            attributeName: string,
            entityType: string,
            name: string,
            id: string,
            required: boolean = true): void {

            let attribute = this.get(attributeName, required);

            if (!attribute) {
                return;
            }

            let value = !id ? null : [{
                id: `{${Core.parseIdentifier(id)}}`,
                name: name,
                entityType: entityType
            }];

            attribute.setValue(value);
        }

        // notifications

        showNotification(attribute: Attribute, message: string, messageId: string): void {

            Validation.ensureNotNullOrUndefined(attribute, "attribute");

            attribute
                .controls
                .forEach((c: Control) => {

                    c.setNotification(message, messageId);
                });
        }

        hideNotification(attribute: Attribute, messageId: string): void {

            Validation.ensureNotNullOrUndefined(attribute, "attribute");

            attribute
                .controls
                .forEach((c: Control) => {

                    c.clearNotification(messageId);
                });
        }
    }
}