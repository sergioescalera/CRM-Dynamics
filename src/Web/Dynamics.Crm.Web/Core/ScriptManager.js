var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var ScriptManager;
        (function (ScriptManager) {
            "use strict";
            var _scripts = {};
            var _stylesheets = [];
            function loadScripts(scripts, document) {
                if (document === void 0) { document = window.document; }
                var deferreds = scripts.map(function (s) { return loadScript(s, document); });
                return jQuery.when(deferreds);
            }
            ScriptManager.loadScripts = loadScripts;
            function loadScript(script, document) {
                if (document === void 0) { document = window.document; }
                console.log("Dynamics.Crm.ScriptManager.loadScript: " + script);
                var promise = _scripts[script];
                if (!!promise) {
                    return promise;
                }
                _scripts[script] = promise = jQuery.Deferred();
                var element = document.createElement("script");
                element.defer = true;
                element.type = "text/javascript";
                element.src = script;
                element.addEventListener("load", function onLoaded() {
                    promise.resolveWith(element);
                });
                document.body.appendChild(element);
                return promise;
            }
            ScriptManager.loadScript = loadScript;
            function loadStylesheets(stylesheets, document) {
                if (document === void 0) { document = window.document; }
                stylesheets.forEach(function (s) { return loadStylesheet(s, document); });
            }
            ScriptManager.loadStylesheets = loadStylesheets;
            function loadStylesheet(stylesheet, document) {
                if (document === void 0) { document = window.document; }
                console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);
                var filter = _stylesheets.filter(function (s) { return s === stylesheet; });
                if (filter.length === 0) {
                    jQuery("head", document)
                        .append("<link rel='stylesheet' href='{path}' />"
                        .replace("{path}", stylesheet));
                    _stylesheets.push(stylesheet);
                }
            }
            ScriptManager.loadStylesheet = loadStylesheet;
        })(ScriptManager = Crm.ScriptManager || (Crm.ScriptManager = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
