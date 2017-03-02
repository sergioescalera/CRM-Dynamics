module Dynamics.Crm.Forms.Attributes {

    "use strict";

    export function get(attributeName: string, required: boolean = true): Attribute {

        var attribute = Xrm.Page.getAttribute(attributeName);

        if (attribute) {
            return attribute;
        }

        var msg = "The specified attribute could not be found: " + attributeName;

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
            for (var i = 0; i < attributeNames.length; i++) {

                var attribute = get(attributeNames[i], false);

                if (attribute) {
                    attribute.setRequiredLevel(requirementLevel);
                }
            }

        } else {

            console.warn("Attributes.setRequirementLevel: Invalid argument. An array was expected.");
        }
    }

    export function setRequiredOrOptional(attributeName: string, required: boolean, attributeRequired: boolean = false): void {

        var attribute = get(attributeName, attributeRequired);

        if (attribute) {
            attribute.setRequiredLevel(required ? AttributeRequiredLevel.Required : AttributeRequiredLevel.None);
        }
    }

    // options

    export function hideOptions(attribute: Attribute, hide?: (o: number) => boolean) {

        var options = attribute.getOptions();

        attribute
            .controls
            .forEach((control: Control) => {

                for (var i = 0; i < options.length; i++) {

                    var option = options[i];

                    var value = parseInt(option.value);

                    if (hide === undefined || hide(value)) {

                        control.removeOption(value);
                    }
                }
            });
    }

    // lookup

    export function getLookupValue(attributeName: string, required: boolean = true): LookupControlItem {

        var attribute = get(attributeName, required);

        if (!attribute) {

            return null;
        }

        var lookup = <any[]>attribute.getValue();

        if (!lookup || !lookup.length) {

            return null;
        }

        return lookup[0];
    }

    export function setLookupValue(attributeName: string, entityType: string, name: string, id: string, required: boolean = true): void {

        var attribute = get(attributeName, required);

        if (!attribute) {
            return;
        }

        var value = !id ? null : [{
            id: id,
            name: name,
            entityType: entityType
        }];

        attribute.setValue(value);
    }

    // notifications

    export function showNotification(attribute: Attribute, message: string, messageId: string): void {

        attribute
            .controls
            .forEach(function (c: Control) {

                c.setNotification(message, messageId);
            });
    }

    export function hideNotification(attribute: Attribute, messageId: string): void {

        attribute
            .controls
            .forEach(function (c: Control) {

                c.clearNotification(messageId);
            });
    }
}