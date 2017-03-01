module Dynamics.Crm.Diagnostics {

    "use strict";

    export interface IError extends Error {
        description?: string;
        stack?: string;
    }

    export interface ILogger {
        Error(message: string, error: IError): void;
        Message(message: string): void;
        Warning(message: string): void;
    }

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

            console.log(message);
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

            console.log(message);
        }
    }

    function createLogEntry(message: string, error: IError): Core.IEntity {

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

        entry.attributes[componentName("name")] = message;
        entry.attributes[componentName("message")] = message;
        entry.attributes[componentName("description")] = description;
        entry.attributes[componentName("source")] = source;
        entry.attributes[componentName("type")] = Dynamics.Crm.Core.LogEntryType.Error;

        return entry;
    }

    function getEntityName(): string {

        try {

            return Xrm.Page.data.entity.getEntityName();

        } catch (e) {

            console.warn(e);

            return "UnknownEntity";
        }
    }

    // trace arguments

    export function printArguments(...args: any[]): void {

        console.log("Function " + arguments[0] + " called with arguments: {");
        for (var i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log("}");
    }

    // variables

    export var debug: boolean = true;
    export var trace: boolean = true;

    export var log: ILogger = new LogEntryLogger();
}