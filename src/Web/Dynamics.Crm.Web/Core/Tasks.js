var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var executeTaskError = {
            htmlMessage: "Something went wrong.<br />\nClearing your browser's cache <u>(using Ctrl + F5)</u> may help solve the problem.",
            errorMessage: "Something went wrong. Clearing your browser's cache (using Ctrl + F5) may help solve the problem.",
            notificationId: "ExecuteTaskErrorNotification"
        };
        var Tasks = /** @class */ (function () {
            function Tasks(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.notity = new Crm.Notifications(page);
            }
            Tasks.prototype.execute = function (tasks, config) {
                if (config === void 0) { config = {
                    displayGenericMessageOnError: true
                }; }
                if (this.notity.supported()) {
                    this.notity.hide(executeTaskError.notificationId);
                }
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tasks.execute", tasks, config);
                }
                var results = [];
                var errors = [];
                if (!Array.isArray(tasks)) {
                    Crm.Diagnostics.log.Warning("Tasks.execute: Invalid argument. An array was expected.");
                }
                else {
                    for (var i = 0; i < tasks.length; i++) {
                        var task = tasks[i];
                        try {
                            var result = task();
                            results.push(result);
                            if (!config.executeAll && !!result) {
                                break;
                            }
                        }
                        catch (e) {
                            Crm.Diagnostics.log.Error(("Tasks.execute: An error has occurred in " + typeof task + " " + this.getTaskName(task)).trim(), e);
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
            };
            Tasks.prototype.displayErrors = function (config, errors) {
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
            };
            Tasks.prototype.getTaskName = function (task) {
                if (typeof task !== "function") {
                    return "";
                }
                var result = /^function\s+([\w\$]+)\s*\(/.exec(task.toString());
                return result ? result[1] : "";
            };
            return Tasks;
        }());
        Crm.Tasks = Tasks;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
