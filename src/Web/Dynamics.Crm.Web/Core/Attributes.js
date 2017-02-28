var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Attributes;
            (function (Attributes) {
                "use strict";
                function get(attributeName, required) {
                    if (required === void 0) { required = true; }
                    var attribute = Xrm.Page.getAttribute(attributeName);
                    if (attribute) {
                        return attribute;
                    }
                    var msg = "The specified attribute could not be found: " + attributeName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Attributes.get = get;
                // requirement level
                function setOptional(attributeNames) {
                    setRequiredLevel(attributeNames, Forms.AttributeRequiredLevel.None);
                }
                Attributes.setOptional = setOptional;
                function setRequired(attributeNames) {
                    setRequiredLevel(attributeNames, Forms.AttributeRequiredLevel.Required);
                }
                Attributes.setRequired = setRequired;
                function setRecommended(attributeNames) {
                    setRequiredLevel(attributeNames, Forms.AttributeRequiredLevel.Recommended);
                }
                Attributes.setRecommended = setRecommended;
                function setRequiredLevel(attributeNames, requirementLevel) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("setRequirementLevel", attributeNames, requirementLevel);
                    }
                    if (Array.isArray(attributeNames)) {
                        for (var i = 0; i < attributeNames.length; i++) {
                            var attribute = get(attributeNames[i], false);
                            if (attribute) {
                                attribute.setRequiredLevel(requirementLevel);
                            }
                        }
                    }
                    else {
                        console.warn("Attributes.setRequirementLevel: Invalid argument. An array was expected.");
                    }
                }
                Attributes.setRequiredLevel = setRequiredLevel;
                function setRequiredOrOptional(attributeName, required, attributeRequired) {
                    if (attributeRequired === void 0) { attributeRequired = false; }
                    var attribute = get(attributeName, attributeRequired);
                    if (attribute) {
                        attribute.setRequiredLevel(required ? Forms.AttributeRequiredLevel.Required : Forms.AttributeRequiredLevel.None);
                    }
                }
                Attributes.setRequiredOrOptional = setRequiredOrOptional;
                // options
                function hideOptions(attribute, hide) {
                    var options = attribute.getOptions();
                    attribute
                        .controls
                        .forEach(function (control) {
                        for (var i = 0; i < options.length; i++) {
                            var option = options[i];
                            var value = parseInt(option.value);
                            if (hide === undefined || hide(value)) {
                                control.removeOption(value);
                            }
                        }
                    });
                }
                Attributes.hideOptions = hideOptions;
                // lookup
                function getLookupValue(attributeName, required) {
                    if (required === void 0) { required = true; }
                    var attribute = get(attributeName, required);
                    if (!attribute) {
                        return null;
                    }
                    var lookup = attribute.getValue();
                    if (!lookup || !lookup.length) {
                        return null;
                    }
                    return lookup[0];
                }
                Attributes.getLookupValue = getLookupValue;
                function setLookupValue(attributeName, entityType, name, id) {
                    var attribute = get(attributeName, false);
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
                Attributes.setLookupValue = setLookupValue;
                // notifications
                function showNotification(attribute, message, messageId) {
                    attribute
                        .controls
                        .forEach(function (c) {
                        c.setNotification(message, messageId);
                    });
                }
                Attributes.showNotification = showNotification;
                function hideNotification(attribute, messageId) {
                    attribute
                        .controls
                        .forEach(function (c) {
                        c.clearNotification(messageId);
                    });
                }
                Attributes.hideNotification = hideNotification;
            })(Attributes = Forms.Attributes || (Forms.Attributes = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
