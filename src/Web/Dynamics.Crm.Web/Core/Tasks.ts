module Dynamics.Crm.Tasks {

    "use strict";

    export interface ITasksConfig {
        continueOnError?: boolean;
        displayGenericMessageOnError?: boolean;
        executeAll?: boolean;
    }

    let executeTaskErrorHtmlMessage: string = `Something went wrong.<br />
Clearing your browser's cache <u>(using Ctrl + F5)</u> may help solve the problem.`;

    let executeTaskErrorMessage: string = `Something went wrong. Clearing your browser's cache (using Ctrl + F5) may help solve the problem.`;

    let executeTaskErrorNotificationId: string = "ExecuteTaskErrorNotification";

    export function execute(
        tasks: ((() => boolean) | (() => void))[],
        config: ITasksConfig = {
            displayGenericMessageOnError: true
        }): any[] {

        if (Forms.Notifications.supported()) {
            Forms.Notifications.hide(executeTaskErrorNotificationId);
        }

        if (Diagnostics.trace) {
            Diagnostics.printArguments("Tasks.execute", tasks, config);
        }

        let results: any[] = [];
        let errors: IError[] = [];

        if (!Array.isArray(tasks)) {

            Diagnostics.log.Warning("Tasks.execute: Invalid argument. An array was expected.");

        } else {

            for (let i: number = 0; i < tasks.length; i++) {

                let task: (() => boolean) | (() => void ) = tasks[i];

                try {

                    let result: boolean | void = task();

                    results.push(result);

                    if (!config.executeAll && !!result) {
                        break;
                    }

                } catch (e) {

                    Diagnostics.log.Error(
                        `Tasks.execute: An error has occurred in ${typeof task} ${getTaskName(task)}`.trim(), e);

                    errors.push(e);
                    results.push(e);

                    if (!config.continueOnError) {
                        break;
                    }
                }
            }
        }

        if (errors.length > 0) {
            displayErrors(config, errors);
        }

        return results;
    }

    function displayErrors(config: ITasksConfig, errors: IError[]): void {

        if (!errors || !errors.length) {
            return;
        }

        if (!config || !config.displayGenericMessageOnError) {
            return;
        }

        if (Forms.Notifications.htmlSupported()) {
            Forms.Notifications.showHtml(
                executeTaskErrorHtmlMessage,
                executeTaskErrorNotificationId,
                Forms.FormNotificationType.Warning);
        } else if (Forms.Notifications.supported()) {
            Forms.Notifications.show(
                executeTaskErrorMessage,
                executeTaskErrorNotificationId,
                Forms.FormNotificationType.Warning);
        }
    }

    function getTaskName(task: Function): string {

        if (typeof task !== "function") {
            return "";
        }

        let result = /^function\s+([\w\$]+)\s*\(/.exec(task.toString());

        return result ? result[1] : "";
    }
}