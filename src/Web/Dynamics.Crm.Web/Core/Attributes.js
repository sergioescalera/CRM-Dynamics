var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var Attributes = /** @class */ (function () {
            function Attributes(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            Attributes.prototype.get = function (attributeName, required) {
                if (required === void 0) { required = true; }
                var attribute = this.page.getAttribute(attributeName);
                if (attribute) {
                    return attribute;
                }
                var msg = "The specified attribute could not be found: " + attributeName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            };
            // requirement level
            Attributes.prototype.setOptional = function (attributeNames) {
                this.setRequiredLevel(attributeNames, Crm.AttributeRequiredLevels.None);
            };
            Attributes.prototype.setRequired = function (attributeNames) {
                this.setRequiredLevel(attributeNames, Crm.AttributeRequiredLevels.Required);
            };
            Attributes.prototype.setRecommended = function (attributeNames) {
                this.setRequiredLevel(attributeNames, Crm.AttributeRequiredLevels.Recommended);
            };
            Attributes.prototype.setRequiredLevel = function (attributeNames, requirementLevel) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("setRequirementLevel", attributeNames, requirementLevel);
                }
                if (Array.isArray(attributeNames)) {
                    for (var i = 0; i < attributeNames.length; i++) {
                        var attribute = this.get(attributeNames[i], false);
                        if (attribute) {
                            attribute.setRequiredLevel(requirementLevel);
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Attributes.setRequirementLevel: Invalid argument. An array was expected.");
                }
            };
            Attributes.prototype.setRequiredOrOptional = function (attributeName, required, attributeRequired) {
                if (attributeRequired === void 0) { attributeRequired = false; }
                var attribute = this.get(attributeName, attributeRequired);
                if (attribute) {
                    attribute.setRequiredLevel(required ? Crm.AttributeRequiredLevels.Required : Crm.AttributeRequiredLevels.None);
                }
            };
            // options
            Attributes.prototype.hideOptions = function (attribute, hide) {
                var options = attribute.getOptions();
                attribute
                    .controls
                    .forEach(function (control) {
                    for (var i = 0; i < options.length; i++) {
                        var option = options[i];
                        var value = option.value;
                        if (hide === undefined || hide(value)) {
                            control.removeOption(value);
                        }
                    }
                });
            };
            // lookup
            Attributes.prototype.getLookupValue = function (attributeName, required) {
                if (required === void 0) { required = true; }
                var attribute = this.get(attributeName, required);
                if (!attribute) {
                    return null;
                }
                var lookup = attribute.getValue();
                if (!lookup || !lookup.length) {
                    return null;
                }
                return lookup[0];
            };
            Attributes.prototype.setLookupValue = function (attributeName, entityType, name, id, required) {
                if (required === void 0) { required = true; }
                var attribute = this.get(attributeName, required);
                if (!attribute) {
                    return;
                }
                var value = !id ? null : [{
                        id: "{" + Crm.Core.parseIdentifier(id) + "}",
                        name: name,
                        entityType: entityType
                    }];
                attribute.setValue(value);
            };
            // notifications
            Attributes.prototype.showNotification = function (attribute, message, messageId) {
                Validation.ensureNotNullOrUndefined(attribute, "attribute");
                attribute
                    .controls
                    .forEach(function (c) {
                    c.setNotification(message, messageId);
                });
            };
            Attributes.prototype.hideNotification = function (attribute, messageId) {
                Validation.ensureNotNullOrUndefined(attribute, "attribute");
                attribute
                    .controls
                    .forEach(function (c) {
                    c.clearNotification(messageId);
                });
            };
            return Attributes;
        }());
        Crm.Attributes = Attributes;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
