"use strict";
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            let DialogType;
            (function (DialogType) {
                DialogType[DialogType["Alert"] = 0] = "Alert";
                DialogType[DialogType["Confirm"] = 1] = "Confirm";
                DialogType[DialogType["Custom"] = 2] = "Custom";
            })(DialogType = Dialogs.DialogType || (Dialogs.DialogType = {}));
            let provider;
            function getProvider() {
                if (!provider) {
                    throw new Error("Dialog provider hasn't been initialized");
                }
                return provider;
            }
            function alert(message, title) {
                return new Promise((resolve, reject) => {
                    getProvider()
                        .Alert(message, title)
                        .then((d) => d
                        .Show()
                        .then(() => {
                        resolve();
                        d.Destroy();
                    })
                        .catch(() => {
                        reject();
                        d.Destroy();
                    }))
                        .catch(() => reject());
                });
            }
            Dialogs.alert = alert;
            function confirm(message, title) {
                return new Promise((resolve, reject) => {
                    getProvider()
                        .Confirm(message, title)
                        .then((d) => d
                        .Show()
                        .then(() => {
                        resolve(true);
                        d.Destroy();
                    })
                        .catch(() => {
                        reject();
                        d.Destroy();
                    }))
                        .catch(() => reject());
                });
            }
            Dialogs.confirm = confirm;
            function create(config) {
                return new Promise((resolve, reject) => {
                    getProvider()
                        .Create(config)
                        .then((diag) => {
                        diag.Show()
                            .then(() => {
                            let result = config.Done();
                            resolve(result);
                            diag.Destroy();
                        })
                            .catch(() => {
                            reject();
                            diag.Destroy();
                        });
                    })
                        .catch(() => reject());
                });
            }
            Dialogs.create = create;
            Dialogs.bootstrapEnabled = true;
            function init(prefix) {
                prefix = prefix;
                provider = new Dialogs.CrmDialogProvider();
            }
            Dialogs.init = init;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
