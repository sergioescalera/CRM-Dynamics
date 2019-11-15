module Dynamics.Crm {

    "use strict";

    let executeTaskError = {

        htmlMessage: `Something went wrong.<br />
Clearing your browser's cache <u>(using Ctrl + F5)</u> may help solve the problem.`,

        errorMessage: `Something went wrong. Clearing your browser's cache (using Ctrl + F5) may help solve the problem.`,

        notificationId: "ExecuteTaskErrorNotification"
    };
    
    export interface ITasksConfig {
        continueOnError?: boolean;
        displayGenericMessageOnError?: boolean;
        executeAll?: boolean;
    }

    export class Tasks {

        protected page: FormContext;
        protected notity: Notifications;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
            this.notity = new Notifications(page);
        }

        execute(
            tasks: ((() => boolean) | (() => void))[],
            config: ITasksConfig = {
                displayGenericMessageOnError: true
            }): any[] {

            if (this.notity.supported()) {
                this.notity.hide(executeTaskError.notificationId);
            }

            if (Diagnostics.trace) {
                Diagnostics.printArguments("Tasks.execute", tasks, config);
            }

            let results: any[] = [];
            let errors: Diagnostics.IError[] = [];

            if (!Array.isArray(tasks)) {

                Diagnostics.log.Warning("Tasks.execute: Invalid argument. An array was expected.");

            } else {

                for (let i: number = 0; i < tasks.length; i++) {

                    let task: (() => boolean) | (() => void) = tasks[i];

                    try {

                        let result: boolean | void = task();

                        results.push(result);

                        if (!config.executeAll && !!result) {
                            break;
                        }

                    } catch (e) {

                        Diagnostics.log.Error(
                            `Tasks.execute: An error has occurred in ${typeof task} ${this.getTaskName(task)}`.trim(), e);

                        errors.push(e);
                        results.push(e);

                        if (!config.continueOnError) {
                            break;
                        }
                    }
                }
            }

            if (errors.length > 0) {
                this.displayErrors(config, errors);
            }

            return results;
        }

        displayErrors(
            config: ITasksConfig,
            errors: Diagnostics.IError[]): void {

            if (!errors || !errors.length) {
                return;
            }

            if (!config || !config.displayGenericMessageOnError) {
                return;
            }

            if (this.notity.htmlSupported()) {

                this.notity.showHtml(
                    executeTaskError.htmlMessage,
                    executeTaskError.notificationId,
                    FormNotificationTypes.Warning);

            } else if (this.notity.supported()) {

                this.notity.show(
                    executeTaskError.errorMessage,
                    executeTaskError.notificationId,
                    FormNotificationTypes.Warning);
            }
        }

        getTaskName(task: Function): string {

            if (typeof task !== "function") {
                return "";
            }

            let result = /^function\s+([\w\$]+)\s*\(/.exec(task.toString());

            return result ? result[1] : "";
        }
    }
}