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

    export function isUci(): boolean {

        try {

            if (typeof Xrm !== "undefined" &&
                typeof Xrm.Internal !== "undefined" && "isUci" in Xrm.Internal) {

                return Xrm.Internal.isUci();
            }

            let context = Xrm.Utility.getGlobalContext();

            let appUrl = context.getCurrentAppUrl();
            let clientUrl = context.getClientUrl();

            return appUrl !== clientUrl;
            
        } catch (e) {

            console.warn("Utility.isUci", e);

            return false;
        }
    }
}