var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Diagnostics;
        (function (Diagnostics) {
            "use strict";
            Diagnostics.debug = true;
            Diagnostics.trace = true;
            class ConsoleLogger {
                constructor(prefix) {
                    this._prefix = prefix;
                }
                Error(message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    let entry = createLogEntry(this._prefix, message, error);
                    console.error(entry);
                }
                Message(message) {
                    console.log(message);
                }
                Warning(message) {
                    console.warn(message);
                }
            }
            class LogEntryLogger {
                constructor(prefix) {
                    this._prefix = prefix;
                }
                Error(message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    let entry = createLogEntry(this._prefix, message, error);
                    console.error(entry);
                    Dynamics.Crm.Data.unitOfWork
                        .GetLogEntryRepository(this._prefix)
                        .Create(entry);
                }
                Message(message) {
                    console.log(message);
                }
                Warning(message) {
                    console.warn(message);
                }
            }
            // public functions
            function useLogEntryLogger(prefix) {
                Diagnostics.log = new LogEntryLogger(prefix || Crm.Publishers.logEntry);
            }
            Diagnostics.useLogEntryLogger = useLogEntryLogger;
            function useConsoleLogger(prefix) {
                Diagnostics.log = new ConsoleLogger(prefix || Crm.Publishers.logEntry);
            }
            Diagnostics.useConsoleLogger = useConsoleLogger;
            function printArguments(...args) {
                console.log(`Function ${arguments[0]} called with arguments: {`);
                for (let i = 1; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                console.log("}");
            }
            Diagnostics.printArguments = printArguments;
            // private function
            function createLogEntry(prefix, message, error) {
                let entityName = getEntityName();
                let entityId = getEntityId();
                let formType = getFormType();
                let clientType = getClientType();
                let formFactor = getFormFactor();
                let stack = error.stack || error.stacktrace || "<none>";
                let desc = error.description || "<none>";
                let source = `JavaScript::${clientType},${formFactor},${formType}:${entityName}(${entityId})`;
                let description = `Stack: ${stack}\nDescription: ${desc}`;
                let entry = {
                    type: Crm.Data.Schema.LogEntryEntity.type(prefix)
                };
                let name = error.type ? `${error.type}:${message}` : message;
                let msg = message === error.message ? message : (`${message}. ${error.message}`.trim());
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
