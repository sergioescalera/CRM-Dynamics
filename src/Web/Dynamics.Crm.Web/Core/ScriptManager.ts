module Dynamics.Crm.ScriptManager {

    "use strict";

    var _scripts = {};
    var _stylesheets = [];

    export function loadScripts(
        scripts: string[],
        document: Document = window.document): JQueryPromise<JQueryPromise<void>[]> {

        var deferreds = scripts.map((s: string) => loadScript(s, document));

        return jQuery.when(deferreds);
    }

    export function loadScript(
        script: string,
        document: Document = window.document): JQueryPromise<void> {

        console.log("Dynamics.Crm.ScriptManager.loadScript: " + script);

        var promise = _scripts[script];

        if (!!promise) {
            return promise;
        }

        _scripts[script] = promise = jQuery.Deferred<void>();
        
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

    export function loadStylesheets(
        stylesheets: string[],
        document: Document = window.document): void {

        stylesheets.forEach((s: string) => loadStylesheet(s, document));
    }

    export function loadStylesheet(
        stylesheet: string,
        document: Document = window.document): void {

        console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);

        var filter = _stylesheets.filter((s: string) => s === stylesheet);

        if (filter.length === 0) {

            jQuery("head", document)
                .append("<link rel='stylesheet' href='{path}' />"
                    .replace("{path}", stylesheet));

            _stylesheets.push(stylesheet);
        }
    }
}