var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var ScriptManager;
        (function (ScriptManager) {
            "use strict";
            let _scripts = {};
            let _stylesheets = [];
            function loadScripts(scripts, win) {
                let promises = scripts.map((s) => loadScript(s, win));
                return Promise.all(promises);
            }
            ScriptManager.loadScripts = loadScripts;
            function loadScript(script, win) {
                console.log("Dynamics.Crm.ScriptManager.loadScript: " + script);
                let promise = _scripts[script];
                if (!!promise) {
                    return promise;
                }
                _scripts[script] = promise = new Promise((resolve, reject) => {
                    let element = win.document.createElement("script");
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
                stylesheets.forEach((s) => loadStylesheet(s, win));
            }
            ScriptManager.loadStylesheets = loadStylesheets;
            function loadStylesheet(stylesheet, win) {
                console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);
                let filter = _stylesheets.filter((s) => s === stylesheet);
                if (filter.length > 0) {
                    return;
                }
                win.$("head", win.document).append(`<link rel='stylesheet' href='${stylesheet}' />`);
                _stylesheets.push(stylesheet);
            }
            ScriptManager.loadStylesheet = loadStylesheet;
        })(ScriptManager = Crm.ScriptManager || (Crm.ScriptManager = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
