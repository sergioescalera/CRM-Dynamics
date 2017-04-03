var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Core;
        (function (Core) {
            "use strict";
            function parseIdentifier(idStr) {
                if (idStr === undefined || idStr == null) {
                    return "";
                }
                return idStr.replace("{", "").replace("}", "").toUpperCase();
            }
            Core.parseIdentifier = parseIdentifier;
            function identifiersAreEqual(id, otherId) {
                if (!id || !otherId) {
                    return false;
                }
                return parseIdentifier(id) === parseIdentifier(otherId);
            }
            Core.identifiersAreEqual = identifiersAreEqual;
        })(Core = Crm.Core || (Crm.Core = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
