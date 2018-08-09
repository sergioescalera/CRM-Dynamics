module Dynamics.Crm.Utility {

    "use strict";

    export function htmlToText(html: string): string {

        if (!html) {
            return html;
        }

        let elem = document.createElement("span");

        elem.innerHTML = html;

        return elem.innerText;
    }
}