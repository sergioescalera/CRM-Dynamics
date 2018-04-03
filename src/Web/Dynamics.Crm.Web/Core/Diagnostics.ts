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

        private _prefix: string;

        constructor(prefix: string) {

            this._prefix = prefix;
        }

        Error(message: string, error: IError): void {

            if (debug) {
                debugger;
            }

            let entry = createLogEntry(this._prefix, message, error);

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

        private _prefix: string;

        constructor(prefix: string) {

            this._prefix = prefix;
        }

        Error(message: string, error: IError): void {

            if (debug) {
                debugger;
            }

            let entry = createLogEntry(this._prefix, message, error);

            console.error(entry);

            Dynamics.Crm.Data.unitOfWork
                .GetLogEntryRepository(this._prefix)
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

    export function useLogEntryLogger(prefix?: string): void {

        log = new LogEntryLogger(prefix || Publishers.logEntry);
    }

    export function useConsoleLogger(prefix?: string): void {

        log = new ConsoleLogger(prefix || Publishers.logEntry);
    }

    export function printArguments(...args: any[]): void {

        console.log(`Function ${arguments[0]} called with arguments: {`);
        for (let i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log("}");
    }

    // private function

    function createLogEntry(prefix: string, message: string, error: IError): Core.ILogEntry {

        let entityName = getEntityName();
        let entityId = getEntityId();
        let formType = getFormType();
        let clientType = getClientType();
        let formFactor = getFormFactor();
        let stack = error.stack || error.stacktrace || "<none>";
        let desc = error.description || "<none>";

        let source = `JavaScript::${clientType},${formFactor},${formType}:${entityName}(${entityId})`;
        let description = `Stack: ${stack}\nDescription: ${desc}`;

        let entry: Core.ILogEntry = {
            type: Data.Schema.LogEntryEntity.type(prefix)
        };

        let name = error.type ? `${error.type}:${message}` : message;
        let msg = message === error.message ? message : (`${message}. ${error.message}`.trim());

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