module Dynamics.Crm.Diagnostics {

    "use strict";

    export interface IError extends Error {
        description?: string;
        stack?: string;
        stacktrace?: string;
        type?: string;
    }

    export interface ILogger {
        Error(message: string, error: IError): void;
        Message(message: string): void;
        Warning(message: string): void;
    }

    export var debug: boolean = true;
    export var trace: boolean = true;

    export var log: ILogger;

    class ConsoleLogger implements ILogger {

        Error(message: string, error: IError): void {

            if (debug) {
                debugger;
            }

            var entry = createLogEntry(Publishers.logEntry, message, error);

            console.error(entry);
        }

        Message(message: string): void {

            console.log(message);
        }

        Warning(message: string): void {

            console.warn(message);
        }
    }

    class LogEntryLogger implements ILogger {

        Error(message: string, error: IError): void {

            if (debug) {
                debugger;
            }

            var entry = createLogEntry(Publishers.logEntry, message, error);

            console.error(entry);

            Dynamics.Crm.Data.unitOfWork
                .GetLogEntryRepository(Publishers.logEntry)
                .Create(entry);
        }

        Message(message: string): void {

            console.log(message);
        }

        Warning(message: string): void {

            console.warn(message);
        }
    }

    // public functions

    export function useLogEntryLogger(): void {

        log = new LogEntryLogger();
    }

    export function useConsoleLogger(): void {

        log = new ConsoleLogger();
    }

    export function printArguments(...args: any[]): void {

        console.log(`Function ${arguments[0]} called with arguments: {`);
        for (var i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log("}");
    }

    // private function

    function createLogEntry(prefix: string, message: string, error: IError): Core.ILogEntry {

        var entityName = getEntityName();
        var entityId = getEntityId();
        var formType = getFormType();
        var clientType = getClientType();
        var formFactor = getFormFactor();
        var stack = error.stack || error.stacktrace || "<none>";
        var desc = error.description || "<none>";

        var source = `JavaScript::${clientType},${formFactor},${formType}:${entityName}(${entityId})`;
        var description = `Stack: ${stack}\nDescription: ${desc}`;

        var entry: Core.ILogEntry = {
            type: Data.Schema.LogEntryEntity.type(prefix)
        };

        var name = error.type ? `${error.type}:${message}` : message;
        var msg = message === error.message ? message : (`${message}. ${error.message}`.trim());

        entry[Data.Schema.LogEntryEntity.nameField(prefix)]
            = Validation.Strings.left(name, 300);
        entry[Data.Schema.LogEntryEntity.messageField(prefix)]
            = Validation.Strings.left(msg, 5000);
        entry[Data.Schema.LogEntryEntity.descriptionField(prefix)]
            = Validation.Strings.right(description, 1048576);
        entry[Data.Schema.LogEntryEntity.sourceField(prefix)]
            = Validation.Strings.left(source, 500);
        entry[Data.Schema.LogEntryEntity.typeField(prefix)]
            = Dynamics.Crm.Core.LogEntryType.Error;

        return entry;
    }

    function getEntityName(): string {

        try {

            return Xrm.Page.data.entity.getEntityName();

        } catch (e) {

            if (trace && log) {
                log.Warning(e);
            }

            return "UnknownEntity";
        }
    }

    function getEntityId(): string {

        try {

            return Xrm.Page.data.entity.getId();

        } catch (e) {

            if (trace && log) {
                log.Warning(e);
            }

            return "";
        }
    }

    function getFormType(): string {

        try {

            return Xrm.Page.ui.getFormType().toString();

        } catch (e) {

            if (trace && log) {
                log.Warning(e);
            }

            return "";
        }
    }

    function getFormFactor(): number {

        try {

            return Forms.getFormFactor();

        } catch (e) {

            if (trace && log) {
                log.Warning(e);
            }

            return -1;
        }
    }

    function getClientType(): string {

        try {

            return Forms.getClientType();

        } catch (e) {

            if (trace && log) {
                log.Warning(e);
            }

            return "unknown";
        }
    }

    // variables

    useLogEntryLogger();
}