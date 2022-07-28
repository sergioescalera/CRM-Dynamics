var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        class Attributes {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            get(attributeName, required = true) {
                let attribute = this.page.getAttribute(attributeName);
                if (attribute) {
                    return attribute;
                }
                let msg = "The specified attribute could not be found: " + attributeName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            }
            // requirement level
            setOptional(attributeNames) {
                this.setRequiredLevel(attributeNames, Crm.AttributeRequiredLevels.None);
            }
            setRequired(attributeNames) {
                this.setRequiredLevel(attributeNames, Crm.AttributeRequiredLevels.Required);
            }
            setRecommended(attributeNames) {
                this.setRequiredLevel(attributeNames, Crm.AttributeRequiredLevels.Recommended);
            }
            setRequiredLevel(attributeNames, requirementLevel) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("setRequirementLevel", attributeNames, requirementLevel);
                }
                if (Array.isArray(attributeNames)) {
                    for (let i = 0; i < attributeNames.length; i++) {
                        let attribute = this.get(attributeNames[i], false);
                        if (attribute) {
                            attribute.setRequiredLevel(requirementLevel);
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Attributes.setRequirementLevel: Invalid argument. An array was expected.");
                }
            }
            setRequiredOrOptional(attributeName, required, attributeRequired = false) {
                let attribute = this.get(attributeName, attributeRequired);
                if (attribute) {
                    attribute.setRequiredLevel(required ? Crm.AttributeRequiredLevels.Required : Crm.AttributeRequiredLevels.None);
                }
            }
            // options
            hideOptions(attribute, hide) {
                let options = attribute.getOptions();
                attribute
                    .controls
                    .forEach((control) => {
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
            getLookupValue(attributeName, required = true) {
                let attribute = this.get(attributeName, required);
                if (!attribute) {
                    return null;
                }
                let lookup = attribute.getValue();
                if (!lookup || !lookup.length) {
                    return null;
                }
                return lookup[0];
            }
            setLookupValue(attributeName, entityType, name, id, required = true) {
                let attribute = this.get(attributeName, required);
                if (!attribute) {
                    return;
                }
                let value = !id ? null : [{
                        id: `{${Crm.Core.parseIdentifier(id)}}`,
                        name: name,
                        entityType: entityType
                    }];
                attribute.setValue(value);
            }
            // notifications
            showNotification(attribute, message, messageId) {
                Validation.ensureNotNullOrUndefined(attribute, "attribute");
                attribute
                    .controls
                    .forEach((c) => {
                    c.setNotification(message, messageId);
                });
            }
            hideNotification(attribute, messageId) {
                Validation.ensureNotNullOrUndefined(attribute, "attribute");
                attribute
                    .controls
                    .forEach((c) => {
                    c.clearNotification(messageId);
                });
            }
        }
        Crm.Attributes = Attributes;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
