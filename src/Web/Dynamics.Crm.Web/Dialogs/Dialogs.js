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
                return new Promise(function (resolve, reject) {
                    getProvider()
                        .Alert(message, title)
                        .then(function (d) { return d
                        .Show()
                        .then(function () {
                        resolve();
                        d.Destroy();
                    })
                        .catch(function () {
                        reject();
                        d.Destroy();
                    }); })
                        .catch(function () { return reject(); });
                });
            }
            Dialogs.alert = alert;
            function confirm(message, title) {
                return new Promise(function (resolve, reject) {
                    getProvider()
                        .Confirm(message, title)
                        .then(function (d) { return d
                        .Show()
                        .then(function () {
                        resolve(true);
                        d.Destroy();
                    })
                        .catch(function () {
                        reject();
                        d.Destroy();
                    }); })
                        .catch(function () { return reject(); });
                });
            }
            Dialogs.confirm = confirm;
            function create(config) {
                return new Promise(function (resolve, reject) {
                    getProvider()
                        .Create(config)
                        .then(function (d) { return d
                        .Show()
                        .then(function () {
                        var result = config.Done();
                        resolve(result);
                    })
                        .catch(function () { return reject(); }); })
                        .catch(function () { return reject(); });
                });
            }
            Dialogs.create = create;
            Dialogs.bootstrapEnabled = true;
            function init(prefix) {
                var win = window.top;
                prefix = prefix || Crm.Publishers.bootstrap;
                provider = Dialogs.bootstrapEnabled ?
                    new Dialogs.BootstrapDialogProvider(win, prefix) :
                    new Dialogs.CrmDialogProvider();
            }
            Dialogs.init = init;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
