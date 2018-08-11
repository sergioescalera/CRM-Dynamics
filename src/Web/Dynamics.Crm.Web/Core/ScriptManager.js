var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var ScriptManager;
        (function (ScriptManager) {
            "use strict";
            var _scripts = {};
            var _stylesheets = [];
            function loadScripts(scripts, win) {
                var promises = scripts.map(function (s) { return loadScript(s, win); });
                return Promise.all(promises);
            }
            ScriptManager.loadScripts = loadScripts;
            function loadScript(script, win) {
                console.log("Dynamics.Crm.ScriptManager.loadScript: " + script);
                var promise = _scripts[script];
                if (!!promise) {
                    return promise;
                }
                _scripts[script] = promise = new Promise(function (resolve, reject) {
                    var element = win.document.createElement("script");
                    element.defer = true;
                    element.type = "text/javascript";
                    element.src = script;
                    element.addEventListener("load", function onLoaded() {
                        resolve();
                    });
                    win.document.body.appendChild(element);
                });
                return promise;
            }
            ScriptManager.loadScript = loadScript;
            function loadStylesheets(stylesheets, win) {
                stylesheets.forEach(function (s) { return loadStylesheet(s, win); });
            }
            ScriptManager.loadStylesheets = loadStylesheets;
            function loadStylesheet(stylesheet, win) {
                console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);
                var filter = _stylesheets.filter(function (s) { return s === stylesheet; });
                if (filter.length > 0) {
                    return;
                }
                win.$("head", win.document).append("<link rel='stylesheet' href='" + stylesheet + "' />");
                _stylesheets.push(stylesheet);
            }
            ScriptManager.loadStylesheet = loadStylesheet;
        })(ScriptManager = Crm.ScriptManager || (Crm.ScriptManager = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
