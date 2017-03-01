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
                    var entry = createLogEntry(message, error);
                    console.error(entry);
                };
                ConsoleLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                ConsoleLogger.prototype.Warning = function (message) {
                    console.log(message);
                };
                return ConsoleLogger;
            }());
            var LogEntryLogger = (function () {
                function LogEntryLogger() {
                }
                LogEntryLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    var entry = createLogEntry(message, error);
                    console.error(entry);
                    Dynamics.Crm.Data.unitOfWork
                        .GetLogEntryRepository()
                        .Create(entry);
                };
                LogEntryLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                LogEntryLogger.prototype.Warning = function (message) {
                    console.log(message);
                };
                return LogEntryLogger;
            }());
            function createLogEntry(message, error) {
                var entityName = getEntityName();
                var source = ("JavaScript::{entityName}")
                    .replace("{entityName}", entityName);
                var description = ("Stack: {stackTrace}\nDescription: {errorDescription}")
                    .replace("{stackTrace}", error.stack || "<none>")
                    .replace("{errorDescription}", error.description || "<none>");
                var entry = {
                    type: Dynamics.Crm.publisherPrefix + "logentry",
                    attributes: {}
                };
                entry.attributes[Crm.componentName("name")] = message;
                entry.attributes[Crm.componentName("message")] = message;
                entry.attributes[Crm.componentName("description")] = description;
                entry.attributes[Crm.componentName("source")] = source;
                entry.attributes[Crm.componentName("type")] = Dynamics.Crm.Core.LogEntryType.Error;
                return entry;
            }
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
            Diagnostics.log = new LogEntryLogger();
        })(Diagnostics = Crm.Diagnostics || (Crm.Diagnostics = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
