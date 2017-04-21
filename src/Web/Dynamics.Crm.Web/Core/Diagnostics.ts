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

            var entry = createLogEntry(message, error);

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

            var entry = createLogEntry(message, error);

            console.error(entry);

            Dynamics.Crm.Data.unitOfWork
                .GetLogEntryRepository()
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

    function createLogEntry(message: string, error: IError): Core.ILogEntry {

        var entityName = getEntityName();
        var entityId = getEntityId();
        var formType = getFormType();
        var stack = error.stack || error.stacktrace || "<none>";
        var desc = error.description || "<none>";

        var source = `JavaScript::${formType}:${entityName}(${entityId})`;
        var description = `Stack: ${stack}\nDescription: ${desc}`;

        var entry: Core.ILogEntry = {
            type: Data.Schema.LogEntryEntity.type
        };

        var name = error.type ? `${error.type}:${message}` : message;
        var msg = message === error.message ? message : (`${message}. ${error.message}`.trim());

        entry[Data.Schema.LogEntryEntity.nameField] = Validation.Strings.left(name, 300);
        entry[Data.Schema.LogEntryEntity.messageField] = Validation.Strings.left(msg, 5000);
        entry[Data.Schema.LogEntryEntity.descriptionField] = Validation.Strings.right(description, 1048576);
        entry[Data.Schema.LogEntryEntity.sourceField] = Validation.Strings.left(source, 500);
        entry[Data.Schema.LogEntryEntity.typeField] = Dynamics.Crm.Core.LogEntryType.Error;

        return entry;
    }

    function getEntityName(): string {

        try {

            return Xrm.Page.data.entity.getEntityName();

        } catch (e) {

            trace && log && log.Warning(e);

            return "UnknownEntity";
        }
    }

    function getEntityId(): string {

        try {

            return Xrm.Page.data.entity.getId();

        } catch (e) {

            trace && log && log.Warning(e);

            return "";
        }
    }

    function getFormType(): string {

        try {

            return Xrm.Page.ui.getFormType().toString();

        } catch (e) {

            trace && log && log.Warning(e);

            return "";
        }
    }

    // variables

    useLogEntryLogger();
}