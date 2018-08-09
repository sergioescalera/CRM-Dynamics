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
        })(Utility = Crm.Utility || (Crm.Utility = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
