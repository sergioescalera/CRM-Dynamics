var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Diagnostics;
        (function (Diagnostics) {
            "use strict";
            Diagnostics.debug = true;
            Diagnostics.trace = true;
            Diagnostics.log = new ConsoleLogger();
            var ConsoleLogger = (function () {
                function ConsoleLogger() {
                }
                ConsoleLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
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
                };
                ConsoleLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                return ConsoleLogger;
            }());
            function getEntityName() {
                try {
                    return Xrm.Page.data.entity.getEntityName();
                }
                catch (e) {
                    console.warn(e);
                    return "UnknownEntity";
                }
            }
            // trace arguments
            function printArguments() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log("Function " + arguments[0] + " called with arguments: {");
                for (var i = 1; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                console.log("}");
            }
            Diagnostics.printArguments = printArguments;
        })(Diagnostics = Crm.Diagnostics || (Crm.Diagnostics = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Diagnostics.js.map