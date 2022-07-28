var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var User;
        (function (User) {
            "use strict";
            function getId() {
                let userId = Xrm.Utility.getGlobalContext().userSettings.userId;
                return Crm.Core.parseIdentifier(userId);
            }
            User.getId = getId;
            function hasRole(roleId) {
                let roles = Xrm.Utility.getGlobalContext().userSettings.securityRoles;
                return roles.filter((r) => Crm.Core.identifiersAreEqual(r, roleId)).length > 0;
            }
            User.hasRole = hasRole;
        })(User = Crm.User || (Crm.User = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
