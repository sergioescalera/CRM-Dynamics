interface JQueryWindow extends Window {
    jQuery: JQueryStatic;
    $: JQueryStatic;
}

module Dynamics.Crm.ScriptManager {

    "use strict";

    let _scripts: _.Dictionary<Promise<void>> = {};
    let _stylesheets: string[] = [];

    export function loadScripts(
        scripts: string[],
        win: JQueryWindow): Promise<void> {

        let promises: Promise<void>[] = scripts.map((s: string) => loadScript(s, win));

        return Promise.all(promises);
    }

    export function loadScript(
        script: string,
        win: JQueryWindow): Promise<void> {

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
            element.addEventListener("load", function onLoaded(): void {

                resolve();
            });

            win.document.body.appendChild(element);
        });

        return promise;
    }

    export function loadStylesheets(
        stylesheets: string[],
        win: JQueryWindow): void {

        stylesheets.forEach((s: string) => loadStylesheet(s, win));
    }

    export function loadStylesheet(
        stylesheet: string,
        win: JQueryWindow): void {

        console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);

        let filter = _stylesheets.filter((s: string) => s === stylesheet);

        if (filter.length > 0) {
            return;
        }

        win.$("head", win.document).append(`<link rel='stylesheet' href='${stylesheet}' />`);

        _stylesheets.push(stylesheet);
    }
}