module Dynamics.Crm.Forms.Attributes {

    "use strict";

    export function get(attributeName: string, required: boolean = true): Attribute {

        let attribute = Xrm.Page.getAttribute(attributeName);

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

    export function setOptional(attributeNames: string[]): void {

        setRequiredLevel(attributeNames, AttributeRequiredLevel.None);
    }

    export function setRequired(attributeNames: string[]): void {

        setRequiredLevel(attributeNames, AttributeRequiredLevel.Required);
    }

    export function setRecommended(attributeNames: string[]): void {

        setRequiredLevel(attributeNames, AttributeRequiredLevel.Recommended);
    }

    export function setRequiredLevel(attributeNames: string[], requirementLevel: string): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("setRequirementLevel", attributeNames, requirementLevel);
        }

        if (Array.isArray(attributeNames)) {
            for (let i = 0; i < attributeNames.length; i++) {

                let attribute = get(attributeNames[i], false);

                if (attribute) {
                    attribute.setRequiredLevel(requirementLevel);
                }
            }

        } else {

            Diagnostics.log.Warning("Attributes.setRequirementLevel: Invalid argument. An array was expected.");
        }
    }

    export function setRequiredOrOptional(attributeName: string, required: boolean, attributeRequired: boolean = false): void {

        let attribute = get(attributeName, attributeRequired);

        if (attribute) {
            attribute.setRequiredLevel(required ? AttributeRequiredLevel.Required : AttributeRequiredLevel.None);
        }
    }

    // options

    export function hideOptions(attribute: Attribute, hide?: (o: number) => boolean): void {

        let options = attribute.getOptions();

        attribute
            .controls
            .forEach((control: Control) => {

                for (let i = 0; i < options.length; i++) {

                    let option = options[i];

                    let value = parseInt(option.value);

                    if (hide === undefined || hide(value)) {

                        control.removeOption(value);
                    }
                }
            });
    }

    // lookup

    export function getLookupValue(attributeName: string, required: boolean = true): LookupControlItem {

        let attribute = get(attributeName, required);

        if (!attribute) {

            return null;
        }

        let lookup = <any[]>attribute.getValue();

        if (!lookup || !lookup.length) {

            return null;
        }

        return lookup[0];
    }

    export function setLookupValue(attributeName: string, entityType: string, name: string, id: string, required: boolean = true): void {

        let attribute = get(attributeName, required);

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

    export function showNotification(attribute: Attribute, message: string, messageId: string): void {

        Validation.ensureNotNullOrUndefined(attribute, "attribute");

        attribute
            .controls
            .forEach((c: Control) => {

                c.setNotification(message, messageId);
            });
    }

    export function hideNotification(attribute: Attribute, messageId: string): void {

        Validation.ensureNotNullOrUndefined(attribute, "attribute");

        attribute
            .controls
            .forEach((c: Control) => {

                c.clearNotification(messageId);
            });
    }
}