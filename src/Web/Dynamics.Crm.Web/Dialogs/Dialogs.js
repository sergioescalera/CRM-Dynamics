var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            (function (DialogType) {
                DialogType[DialogType["Alert"] = 0] = "Alert";
                DialogType[DialogType["Confirm"] = 1] = "Confirm";
                DialogType[DialogType["Custom"] = 2] = "Custom";
            })(Dialogs.DialogType || (Dialogs.DialogType = {}));
            var DialogType = Dialogs.DialogType;
            var provider;
            function getProvider() {
                if (!provider) {
                    provider = new Dialogs.BootstrapDialogProvider(window.top);
                }
                return provider;
            }
            function alert(message, title) {
                var deferred = $.Deferred();
                getProvider()
                    .Alert(message, title)
                    .done(function (d) { return d
                    .Show()
                    .done(function () { return deferred.resolve(); })
                    .fail(function () { return deferred.reject(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.alert = alert;
            function confirm(message, title) {
                var deferred = $.Deferred();
                getProvider()
                    .Confirm(message, title)
                    .done(function (d) { return d
                    .Show()
                    .done(function (r) { return deferred.resolve(r); })
                    .fail(function () { return deferred.reject(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.confirm = confirm;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Dialogs.js.map