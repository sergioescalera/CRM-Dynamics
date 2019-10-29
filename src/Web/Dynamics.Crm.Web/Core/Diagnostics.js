var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Diagnostics;
        (function (Diagnostics) {
            "use strict";
            Diagnostics.debug = true;
            Diagnostics.trace = true;
            var ConsoleLogger = /** @class */ (function () {
                function ConsoleLogger(prefix) {
                    this._prefix = prefix;
                }
                ConsoleLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    var entry = createLogEntry(this._prefix, message, error);
                    console.error(entry);
                };
                ConsoleLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                ConsoleLogger.prototype.Warning = function (message) {
                    console.warn(message);
                };
                return ConsoleLogger;
            }());
            var LogEntryLogger = /** @class */ (function () {
                function LogEntryLogger(prefix) {
                    this._prefix = prefix;
                }
                LogEntryLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    var entry = createLogEntry(this._prefix, message, error);
                    console.error(entry);
                    Dynamics.Crm.Data.unitOfWork
                        .GetLogEntryRepository(this._prefix)
                        .Create(entry);
                };
                LogEntryLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                LogEntryLogger.prototype.Warning = function (message) {
                    console.warn(message);
                };
                return LogEntryLogger;
            }());
            // public functions
            function useLogEntryLogger(prefix) {
                Diagnostics.log = new LogEntryLogger(prefix || Crm.Publishers.logEntry);
            }
            Diagnostics.useLogEntryLogger = useLogEntryLogger;
            function useConsoleLogger(prefix) {
                Diagnostics.log = new ConsoleLogger(prefix || Crm.Publishers.logEntry);
            }
            Diagnostics.useConsoleLogger = useConsoleLogger;
            function printArguments() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log("Function " + arguments[0] + " called with arguments: {");
                for (var i = 1; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                console.log("}");
            }
            Diagnostics.printArguments = printArguments;
            // private function
            function createLogEntry(prefix, message, error) {
                var entityName = getEntityName();
                var entityId = getEntityId();
                var formType = getFormType();
                var clientType = getClientType();
                var formFactor = getFormFactor();
                var stack = error.stack || error.stacktrace || "<none>";
                var desc = error.description || "<none>";
                var source = "JavaScript::" + clientType + "," + formFactor + "," + formType + ":" + entityName + "(" + entityId + ")";
                var description = "Stack: " + stack + "\nDescription: " + desc;
                var entry = {
                    type: Crm.Data.Schema.LogEntryEntity.type(prefix)
                };
                var name = error.type ? error.type + ":" + message : message;
                var msg = message === error.message ? message : ((message + ". " + error.message).trim());
                entry[Crm.Data.Schema.LogEntryEntity.nameField(prefix)]
                    = Validation.Strings.left(name, 300);
                entry[Crm.Data.Schema.LogEntryEntity.messageField(prefix)]
                    = Validation.Strings.left(msg, 5000);
                entry[Crm.Data.Schema.LogEntryEntity.descriptionField(prefix)]
                    = Validation.Strings.right(description, 1048576);
                entry[Crm.Data.Schema.LogEntryEntity.sourceField(prefix)]
                    = Validation.Strings.left(source, 500);
                entry[Crm.Data.Schema.LogEntryEntity.typeField(prefix)]
                    = Dynamics.Crm.Core.LogEntryType.Error;
                return entry;
            }
            function getEntityName() {
                try {
                    return Xrm["Page"].data.entity.getEntityName();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "UnknownEntity";
                }
            }
            function getEntityId() {
                try {
                    return Xrm["Page"].data.entity.getId();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "";
                }
            }
            function getFormType() {
                try {
                    return Xrm["Page"].ui.getFormType().toString();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "";
                }
            }
            function getFormFactor() {
                try {
                    return Xrm.Utility.getGlobalContext().client.getFormFactor();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return -1;
                }
            }
            function getClientType() {
                try {
                    return Xrm.Utility.getGlobalContext().client.getClient();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "unknown";
                }
            }
            // variables
            useLogEntryLogger();
        })(Diagnostics = Crm.Diagnostics || (Crm.Diagnostics = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
