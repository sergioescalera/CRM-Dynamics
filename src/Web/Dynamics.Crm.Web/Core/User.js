var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var User;
        (function (User) {
            function getId() {
                var userId = Xrm.Page.context.getUserId();
                return Crm.Core.parseIdentifier(userId);
            }
            User.getId = getId;
        })(User = Crm.User || (Crm.User = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=User.js.map