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

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        Crm.publisherPrefix = "sib_";
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            var FormNotificationType = (function () {
                function FormNotificationType() {
                }
                FormNotificationType.Error = "ERROR";
                FormNotificationType.Warning = "WARNING";
                FormNotificationType.Information = "INFO";
                return FormNotificationType;
            }());
            Forms.FormNotificationType = FormNotificationType;
            var ClientType = (function () {
                function ClientType() {
                }
                ClientType.Browser = "Web";
                ClientType.Outlook = "Outlook";
                ClientType.Mobile = "Mobile";
                return ClientType;
            }());
            Forms.ClientType = ClientType;
            var AttributeRequiredLevel = (function () {
                function AttributeRequiredLevel() {
                }
                AttributeRequiredLevel.None = "none";
                AttributeRequiredLevel.Required = "required";
                AttributeRequiredLevel.Recommended = "recommended";
                return AttributeRequiredLevel;
            }());
            Forms.AttributeRequiredLevel = AttributeRequiredLevel;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Controls;
            (function (Controls) {
                "use strict";
                function get(controlName, required) {
                    if (required === void 0) { required = true; }
                    var control = Xrm.Page.getControl(controlName);
                    if (control) {
                        return control;
                    }
                    var msg = "The specified control could not be found: " + controlName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Controls.get = get;
                // enable / disable
                function disable(attributeNames, all) {
                    if (all === void 0) { all = true; }
                    setDisabled(attributeNames, true, all);
                }
                Controls.disable = disable;
                function enable(attributeNames, all) {
                    if (all === void 0) { all = true; }
                    setDisabled(attributeNames, false, all);
                }
                Controls.enable = enable;
                function setDisabled(attributeNames, disabled, all) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("setDisabled", attributeNames, disabled);
                    }
                    if (Array.isArray(attributeNames)) {
                        for (var i = 0; i < attributeNames.length; i++) {
                            if (all) {
                                var attribute = Forms.Attributes.get(attributeNames[i], false);
                                if (attribute) {
                                    attribute.controls.forEach(function (c) { return c.setDisabled(disabled); });
                                }
                            }
                            else {
                                var control = get(attributeNames[i], false);
                                if (control) {
                                    control.setDisabled(disabled);
                                }
                            }
                        }
                    }
                    else {
                        console.warn("Controls.setDisabled: Invalid argument. An array was expected.");
                    }
                }
                Controls.setDisabled = setDisabled;
                // show / hide
                function show(attributeNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(attributeNames, true, true);
                    }
                }
                Controls.show = show;
                function hide(attributeNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(attributeNames, false, true);
                    }
                }
                Controls.hide = hide;
                function setVisible(attributeNames, value, all) {
                    Crm.Diagnostics.printArguments("setDisabled", attributeNames, value);
                    if (Array.isArray(attributeNames)) {
                        for (var i = 0; i < attributeNames.length; i++) {
                            if (all) {
                                var attribute = Forms.Attributes.get(attributeNames[i], false);
                                if (attribute) {
                                    attribute.controls.forEach(function (c) { return c.setVisible(value); });
                                }
                            }
                            else {
                                var control = get(attributeNames[i], false);
                                if (control) {
                                    control.setVisible(value);
                                }
                            }
                        }
                    }
                    else {
                        console.warn("Invalid argument. An array was expected.");
                        console.log(attributeNames);
                    }
                }
            })(Controls = Forms.Controls || (Forms.Controls = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Diagnostics;
        (function (Diagnostics) {
            "use strict";
            var ConsoleLogger = (function () {
                function ConsoleLogger() {
                }
                ConsoleLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    var entityName = getEntityName();
                    var output = "{message}" +
                        " - Entity: {entityName}" +
                        " - Name: {errorName}" +
                        " - Message: {errorMessage}" +
                        " - Stack: {stackTrace}" +
                        " - Description: {errorDescription}"
                            .replace("{entityName}", entityName)
                            .replace("{message}", message)
                            .replace("{errorMessage}", error.message)
                            .replace("{errorName}", error.name)
                            .replace("{stackTrace}", error.stack || "<NoStackTrace>")
                            .replace("{errorDescription}", error.description || "<NoDescription>");
                    console.error(output);
                };
                ConsoleLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                return ConsoleLogger;
            }());
            function getEntityName() {
                try {
                    return Xrm.Page.data.entity.getEntityName();
                }
                catch (e) {
                    console.warn(e);
                    return "UnknownEntity";
                }
            }
            // trace arguments
            function printArguments() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log("Function " + arguments[0] + " called with arguments: {");
                for (var i = 1; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                console.log("}");
            }
            Diagnostics.printArguments = printArguments;
            // variables
            Diagnostics.debug = true;
            Diagnostics.trace = true;
            Diagnostics.log = new ConsoleLogger();
        })(Diagnostics = Crm.Diagnostics || (Crm.Diagnostics = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            function open(dialogId, entityName, entityId, width, height, modal) {
                if (width === void 0) { width = 800; }
                if (height === void 0) { height = 600; }
                if (modal === void 0) { modal = "yes"; }
                var url = getUrl(dialogId, entityName, entityId);
                var features = "center=yes,width={w},height={h},modal={m}"
                    .replace("{m}", modal)
                    .replace("{h}", height.toString())
                    .replace("{w}", width.toString());
                window.open(url, dialogId, features, false);
            }
            Dialogs.open = open;
            function getUrl(dialogId, entityName, entityId) {
                if (entityName === void 0) { entityName = Xrm.Page.data.entity.getEntityName(); }
                if (entityId === void 0) { entityId = Xrm.Page.data.entity.getId(); }
                var url = Xrm.Page.context.getClientUrl() +
                    "/cs/dialog/rundialog.aspx?DialogId={dialogId}&EntityName={type}&ObjectId={id}"
                        .replace("{type}", entityName)
                        .replace("{id}", entityId);
                return url;
            }
            Dialogs.getUrl = getUrl;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Core;
        (function (Core) {
            "use strict";
            function parseIdentifier(idStr) {
                if (idStr === undefined || idStr == null) {
                    return "";
                }
                return idStr.replace("{", "").replace("}", "").toLowerCase();
            }
            Core.parseIdentifier = parseIdentifier;
            function identifiersAreEqual(id, otherId) {
                if (!id || !otherId) {
                    return false;
                }
                return parseIdentifier(id) === parseIdentifier(otherId);
            }
            Core.identifiersAreEqual = identifiersAreEqual;
        })(Core = Crm.Core || (Crm.Core = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            (function (FormType) {
                FormType[FormType["Undefined"] = 0] = "Undefined";
                FormType[FormType["Create"] = 1] = "Create";
                FormType[FormType["Update"] = 2] = "Update";
                FormType[FormType["ReadOnly"] = 3] = "ReadOnly";
                FormType[FormType["Disabled"] = 4] = "Disabled";
                FormType[FormType["QuickCreate"] = 5] = "QuickCreate";
                FormType[FormType["BulkEdit"] = 6] = "BulkEdit";
                FormType[FormType["ReadOptimized"] = 11] = "ReadOptimized";
            })(Forms.FormType || (Forms.FormType = {}));
            var FormType = Forms.FormType;
            (function (FormFactor) {
                FormFactor[FormFactor["Unknown"] = 0] = "Unknown";
                FormFactor[FormFactor["Desktop"] = 1] = "Desktop";
                FormFactor[FormFactor["Tablet"] = 2] = "Tablet";
                FormFactor[FormFactor["Phone"] = 3] = "Phone";
            })(Forms.FormFactor || (Forms.FormFactor = {}));
            var FormFactor = Forms.FormFactor;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            function getClientType() {
                return Xrm.Page.context.client.getClient();
            }
            Forms.getClientType = getClientType;
            function getFormType() {
                return Xrm.Page.ui.getFormType();
            }
            Forms.getFormType = getFormType;
            function getFormFactor() {
                if (!Xrm.Page.context.client.getFormFactor) {
                    return Forms.FormFactor.Unknown;
                }
                return Xrm.Page.context.client.getFormFactor();
            }
            Forms.getFormFactor = getFormFactor;
            function getIsDesktop() {
                var formFactor = getFormFactor();
                if (formFactor !== Forms.FormFactor.Unknown) {
                    return formFactor === Forms.FormFactor.Desktop;
                }
                return getClientType() !== Forms.ClientType.Mobile;
            }
            Forms.getIsDesktop = getIsDesktop;
            function getIsDirty() {
                return Xrm.Page.data.entity.getIsDirty();
            }
            Forms.getIsDirty = getIsDirty;
            function supportsIFrames() {
                return getIsDesktop();
            }
            Forms.supportsIFrames = supportsIFrames;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));


var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Navigation;
            (function (Navigation) {
                "use strict";
                function get(itemName, required) {
                    if (required === void 0) { required = false; }
                    var item = Xrm.Page.ui.navigation.items.get(itemName);
                    if (item) {
                        return item;
                    }
                    var msg = "The specified navigation item could not be found: " + itemName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Navigation.get = get;
                function show(items) {
                    setVisible(items, true);
                }
                Navigation.show = show;
                function hide(items) {
                    setVisible(items, false);
                }
                Navigation.hide = hide;
                function setVisible(items, visible) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Navigation.setVisible", items);
                    }
                    if (Array.isArray(items)) {
                        var value = !!visible;
                        for (var i = 0; i < items.length; i++) {
                            var item = get(items[i]);
                            if (!item) {
                                continue;
                            }
                            if (item.getVisible() !== value) {
                                item.setVisible(value);
                            }
                        }
                    }
                    else {
                        console.warn("Navigation.setVisible: Invalid argument. An array was expected.");
                    }
                }
                Navigation.setVisible = setVisible;
            })(Navigation = Forms.Navigation || (Forms.Navigation = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Reports;
        (function (Reports) {
            "use strict";
            function getUrl(reportName, reportId, entityId, entityCode, action) {
                if (entityId === void 0) { entityId = null; }
                if (entityCode === void 0) { entityCode = null; }
                if (action === void 0) { action = "run"; }
                var url = Xrm.Page.context.getClientUrl();
                var reportUrl = url + "/crmreports/viewer/viewer.aspx?action={action}&helpID={name}&id={{id}}"
                    .replace("{action}", encodeURIComponent(action))
                    .replace("{name}", encodeURIComponent(reportName))
                    .replace("{id}", encodeURIComponent(reportId));
                if (entityId && entityCode) {
                    reportUrl += "&context=records&records={{entityId}}&recordstype={entityCode}"
                        .replace("{entityId}", entityId)
                        .replace("{entityCode}", entityCode);
                }
                return reportUrl;
            }
            Reports.getUrl = getUrl;
        })(Reports = Crm.Reports || (Crm.Reports = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var ScriptManager;
        (function (ScriptManager) {
            "use strict";
            var _scripts = {};
            var _stylesheets = [];
            function loadScripts(scripts, document) {
                if (document === void 0) { document = window.document; }
                var deferreds = scripts.map(function (s) { return loadScript(s, document); });
                return jQuery.when(deferreds);
            }
            ScriptManager.loadScripts = loadScripts;
            function loadScript(script, document) {
                console.log("Dynamics.Crm.ScriptManager.loadScript: " + script);
                var promise = _scripts[script];
                if (!!promise) {
                    return promise;
                }
                _scripts[script] = promise = jQuery.Deferred();
                var element = document.createElement("script");
                element.defer = true;
                element.type = "text/javascript";
                element.src = script;
                element.addEventListener("load", function onLoaded() {
                    promise.resolveWith(element);
                });
                document.body.appendChild(element);
                return promise;
            }
            ScriptManager.loadScript = loadScript;
            function loadStylesheets(stylesheets, document) {
                if (document === void 0) { document = window.document; }
                stylesheets.forEach(function (s) { return loadStylesheet(s, document); });
            }
            ScriptManager.loadStylesheets = loadStylesheets;
            function loadStylesheet(stylesheet, document) {
                console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);
                var filter = _stylesheets.filter(function (s) { return s === stylesheet; });
                if (filter.length === 0) {
                    jQuery("head", document)
                        .append("<link rel='stylesheet' href='{path}' />"
                        .replace("{path}", stylesheet));
                    _stylesheets.push(stylesheet);
                }
            }
            ScriptManager.loadStylesheet = loadStylesheet;
        })(ScriptManager = Crm.ScriptManager || (Crm.ScriptManager = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Sections;
            (function (Sections) {
                "use strict";
                function get(tabName, sectionName, required) {
                    if (required === void 0) { required = true; }
                    var tab = Forms.Tabs.get(tabName, required);
                    if (!tab) {
                        return null;
                    }
                    var section = tab.sections.get(sectionName);
                    if (section) {
                        return section;
                    }
                    var msg = "The specified section could not be found: " + tabName + " - " + sectionName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Sections.get = get;
            })(Sections = Forms.Sections || (Forms.Sections = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Tabs;
            (function (Tabs) {
                "use strict";
                function get(tabName, required) {
                    if (required === void 0) { required = true; }
                    var tab = Xrm.Page.ui.tabs.get(tabName);
                    if (tab) {
                        return tab;
                    }
                    var msg = "The specified tab could not be found: " + tabName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Tabs.get = get;
                // show / hide
                function show(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(tabNames, true);
                    }
                }
                Tabs.show = show;
                function hide(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(tabNames, false);
                    }
                }
                Tabs.hide = hide;
                function setVisible(tabNames, value) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Tabs.setVisible", tabNames, value);
                    }
                    if (Array.isArray(tabNames)) {
                        for (var i = 0; i < tabNames.length; i++) {
                            var tab = get(tabNames[i], false);
                            if (tab) {
                                tab.setVisible(value);
                            }
                        }
                    }
                    else {
                        console.warn("Tabs.setVisible: Invalid argument. An array was expected.");
                    }
                }
                Tabs.setVisible = setVisible;
                // expand / collapse
                function expand(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        expandCollapse(tabNames, true);
                    }
                }
                Tabs.expand = expand;
                function collpase(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        expandCollapse(tabNames, false);
                    }
                }
                Tabs.collpase = collpase;
                function expandCollapse(tabNames, value) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Tabs.expandCollapse", tabNames, value);
                    }
                    if (Array.isArray(tabNames)) {
                        for (var i = 0; i < tabNames.length; i++) {
                            var tab = get(tabNames[i], false);
                            if (tab) {
                                tab.setDisplayState(value ? "expanded" : "collapsed");
                            }
                        }
                    }
                    else {
                        console.warn("Tabs.expandCollapse: Invalid argument. An array was expected.");
                    }
                }
                Tabs.expandCollapse = expandCollapse;
            })(Tabs = Forms.Tabs || (Forms.Tabs = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Tasks;
        (function (Tasks) {
            "use strict";
            function execute(tasks, config) {
                if (config === void 0) { config = {}; }
                var results = [];
                if (!Array.isArray(tasks)) {
                    console.warn("Tasks.run: Invalid argument. An array was expected.");
                }
                else {
                    for (var i = 0; i < tasks.length; i++) {
                        var task = tasks[i];
                        try {
                            var result = task();
                            results.push(result);
                            if (!config.executeAll && !!result) {
                                return results;
                            }
                        }
                        catch (e) {
                            Crm.Diagnostics.log.Error("Tasks.execute:{taskName}".replace("{taskName}", getTaskName(task)), e);
                            results.push(e);
                            if (!config.continueOnError) {
                                return results;
                            }
                        }
                    }
                }
                return results;
            }
            Tasks.execute = execute;
            function getTaskName(task) {
                return "";
            }
        })(Tasks = Crm.Tasks || (Crm.Tasks = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));