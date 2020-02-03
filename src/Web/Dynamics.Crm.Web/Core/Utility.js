var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Utility;
        (function (Utility) {
            "use strict";
            function htmlToText(html) {
                if (!html) {
                    return html;
                }
                var elem = document.createElement("span");
                elem.innerHTML = html;
                return elem.innerText;
            }
            Utility.htmlToText = htmlToText;
            function isUci() {
                try {
                    if (typeof Xrm !== "undefined" &&
                        typeof Xrm.Internal !== "undefined" && "isUci" in Xrm.Internal) {
                        return Xrm.Internal.isUci();
                    }
                    var context = Xrm.Utility.getGlobalContext();
                    var appUrl = context.getCurrentAppUrl();
                    var clientUrl = context.getClientUrl();
                    return appUrl !== clientUrl;
                }
                catch (e) {
                    console.warn("Utility.isUci", e);
                    return false;
                }
            }
            Utility.isUci = isUci;
        })(Utility = Crm.Utility || (Crm.Utility = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
