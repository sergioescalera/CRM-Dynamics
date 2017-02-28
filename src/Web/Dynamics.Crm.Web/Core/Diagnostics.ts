module Dynamics.Crm.Diagnostics {

    "use strict";

    export var debug: boolean = true;
    export var trace: boolean = true;
    export var log: ILogger = new ConsoleLogger();

    export interface IError extends Error {
        description?: string;
        stack?: string;
    }

    export interface ILogger {
        Error(message: string, error: IError): void;
        Message(message: string): void;
    }

    class ConsoleLogger implements ILogger {

        Error(message: string, error: IError): void {

            if (debug) {
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
        }

        Message(message: string): void {

            console.log(message);
        }
    }

    function getEntityName() {

        try {

            return Xrm.Page.data.entity.getEntityName();

        } catch (e) {

            console.warn(e);

            return "UnknownEntity";
        }
    }

    // trace arguments

    export function printArguments(...args: any[]) {

        console.log("Function " + arguments[0] + " called with arguments: {");
        for (var i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log("}");
    }
}