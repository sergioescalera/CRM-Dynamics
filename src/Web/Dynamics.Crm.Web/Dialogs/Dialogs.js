var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            var DialogType;
            (function (DialogType) {
                DialogType[DialogType["Alert"] = 0] = "Alert";
                DialogType[DialogType["Confirm"] = 1] = "Confirm";
                DialogType[DialogType["Custom"] = 2] = "Custom";
            })(DialogType = Dialogs.DialogType || (Dialogs.DialogType = {}));
            var provider;
            function getProvider() {
                if (!provider) {
                    throw new Error("Dialog provider hasn't been initialized");
                }
                return provider;
            }
            function alert(message, title) {
                var win = window.top;
                var deferred = win.$.Deferred();
                getProvider()
                    .Alert(message, title)
                    .done(function (d) { return d
                    .Show()
                    .done(function () { return deferred.resolve(); })
                    .fail(function () { return deferred.reject(); })
                    .always(function () { return d.Destroy(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.alert = alert;
            function confirm(message, title) {
                var win = window.top;
                var deferred = win.$.Deferred();
                getProvider()
                    .Confirm(message, title)
                    .done(function (d) { return d
                    .Show()
                    .done(function () { return deferred.resolve(true); })
                    .fail(function () { return deferred.reject(); })
                    .always(function () { return d.Destroy(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.confirm = confirm;
            function create(config) {
                var win = window.top;
                var deferred = win.$.Deferred();
                getProvider()
                    .Create(config)
                    .done(function (d) { return d
                    .Show()
                    .done(function () {
                    var result = config.Done();
                    deferred.resolve(result);
                })
                    .fail(function () { return deferred.reject(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.create = create;
            Dialogs.bootstrapEnabled = true;
            function init(prefix) {
                var win = window.top;
                prefix = prefix || Crm.Publishers.bootstrap;
                provider = Dialogs.bootstrapEnabled ?
                    new Dialogs.BootstrapDialogProvider(win, prefix) :
                    new Dialogs.CrmDialogProvider(win);
            }
            Dialogs.init = init;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
