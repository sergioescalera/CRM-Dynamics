var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        let executeTaskError = {
            htmlMessage: `Something went wrong.<br />
Clearing your browser's cache <u>(using Ctrl + F5)</u> may help solve the problem.`,
            errorMessage: `Something went wrong. Clearing your browser's cache (using Ctrl + F5) may help solve the problem.`,
            notificationId: "ExecuteTaskErrorNotification"
        };
        class Tasks {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.notity = new Crm.Notifications(page);
            }
            execute(tasks, config = {
                displayGenericMessageOnError: true
            }) {
                if (this.notity.supported()) {
                    this.notity.hide(executeTaskError.notificationId);
                }
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tasks.execute", tasks, config);
                }
                let results = [];
                let errors = [];
                if (!Array.isArray(tasks)) {
                    Crm.Diagnostics.log.Warning("Tasks.execute: Invalid argument. An array was expected.");
                }
                else {
                    for (let i = 0; i < tasks.length; i++) {
                        let task = tasks[i];
                        try {
                            let result = task();
                            results.push(result);
                            if (!config.executeAll && !!result) {
                                break;
                            }
                        }
                        catch (e) {
                            Crm.Diagnostics.log.Error(`Tasks.execute: An error has occurred in ${typeof task} ${this.getTaskName(task)}`.trim(), e);
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
            displayErrors(config, errors) {
                if (!errors || !errors.length) {
                    return;
                }
                if (!config || !config.displayGenericMessageOnError) {
                    return;
                }
                if (this.notity.htmlSupported()) {
                    this.notity.showHtml(executeTaskError.htmlMessage, executeTaskError.notificationId, Crm.FormNotificationTypes.Warning);
                }
                else if (this.notity.supported()) {
                    this.notity.show(executeTaskError.errorMessage, executeTaskError.notificationId, Crm.FormNotificationTypes.Warning);
                }
            }
            getTaskName(task) {
                if (typeof task !== "function") {
                    return "";
                }
                let result = /^function\s+([\w\$]+)\s*\(/.exec(task.toString());
                return result ? result[1] : "";
            }
        }
        Crm.Tasks = Tasks;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
