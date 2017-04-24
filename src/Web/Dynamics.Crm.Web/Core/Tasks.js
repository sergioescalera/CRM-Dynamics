var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Tasks;
        (function (Tasks) {
            "use strict";
            var executeTaskErrorHtmlMessage = "Something went wrong.<br />\nClearing your browser's cache <u>(using Ctrl + F5)</u> may help solve the problem.";
            var executeTaskErrorMessage = "Something went wrong. Clearing your browser's cache (using Ctrl + F5) may help solve the problem.";
            var executeTaskErrorNotificationId = "ExecuteTaskErrorNotification";
            function execute(tasks, config) {
                if (config === void 0) { config = {
                    displayGenericMessageOnError: true
                }; }
                if (Crm.Forms.Notifications.supported()) {
                    Crm.Forms.Notifications.hide(executeTaskErrorNotificationId);
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
                            Crm.Diagnostics.log.Error(("Tasks.execute: An error has occurred in " + typeof task + " " + getTaskName(task)).trim(), e);
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
            Tasks.execute = execute;
            function displayErrors(config, errors) {
                if (!errors || !errors.length) {
                    return;
                }
                if (!config || !config.displayGenericMessageOnError) {
                    return;
                }
                if (Crm.Forms.Notifications.htmlSupported()) {
                    Crm.Forms.Notifications.showHtml(executeTaskErrorHtmlMessage, executeTaskErrorNotificationId, Crm.Forms.FormNotificationType.Warning);
                }
                else if (Crm.Forms.Notifications.supported()) {
                    Crm.Forms.Notifications.show(executeTaskErrorMessage, executeTaskErrorNotificationId, Crm.Forms.FormNotificationType.Warning);
                }
            }
            function getTaskName(task) {
                if (typeof task !== "function") {
                    return "";
                }
                var result = /^function\s+([\w\$]+)\s*\(/.exec(task.toString());
                return result ? result[1] : "";
            }
        })(Tasks = Crm.Tasks || (Crm.Tasks = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
