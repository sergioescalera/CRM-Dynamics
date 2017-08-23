var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var User;
        (function (User) {
            "use strict";
            function getId() {
                var userId = Xrm.Page.context.getUserId();
                return Crm.Core.parseIdentifier(userId);
            }
            User.getId = getId;
            function hasRole(roleId) {
                var roles = Xrm.Page.context.getUserRoles();
                return roles.filter(function (r) { return Crm.Core.identifiersAreEqual(r, roleId); }).length > 0;
            }
            User.hasRole = hasRole;
        })(User = Crm.User || (Crm.User = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
