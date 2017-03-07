var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Tasks;
        (function (Tasks) {
            "use strict";
            function execute(tasks, config) {
                if (config === void 0) { config = {}; }
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tasks.execute", tasks, config);
                }
                var results = [];
                if (!Array.isArray(tasks)) {
                    Crm.Diagnostics.log.Warning("Tasks.run: Invalid argument. An array was expected.");
                }
                else {
                    for (var i = 0; i < tasks.length; i++) {
                        var task = tasks[i];
                        try {
                            var result = task();
                            results.push(result);
                            if (!config.executeAll && !!result) {
                                return results;
                            }
                        }
                        catch (e) {
                            Crm.Diagnostics.log.Error("Tasks.execute: An error has occurred.", e);
                            results.push(e);
                            if (!config.continueOnError) {
                                return results;
                            }
                        }
                    }
                }
                return results;
            }
            Tasks.execute = execute;
            function getTaskName(task) {
                return "";
            }
        })(Tasks = Crm.Tasks || (Crm.Tasks = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
