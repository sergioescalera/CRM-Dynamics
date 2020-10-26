"use strict";
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
                        .then(function (diag) {
                        diag.Show()
                            .then(function () {
                            var result = config.Done();
                            resolve(result);
                            diag.Destroy();
                        })
                            .catch(function () {
                            reject();
                            diag.Destroy();
                        });
                    })
                        .catch(function () { return reject(); });
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

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            var CrmAlertDialog = /** @class */ (function () {
                function CrmAlertDialog(message) {
                    this._message = message;
                }
                CrmAlertDialog.prototype.Show = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        Xrm.Navigation
                            .openAlertDialog({
                            confirmButtonLabel: "Ok",
                            text: _this._message
                        }).then(function () { return resolve(); });
                    });
                };
                CrmAlertDialog.prototype.Destroy = function () {
                };
                return CrmAlertDialog;
            }());
            Dialogs.CrmAlertDialog = CrmAlertDialog;
            var CrmConfirmDialog = /** @class */ (function () {
                function CrmConfirmDialog(message, title) {
                    this._message = message;
                    this._title = title;
                }
                CrmConfirmDialog.prototype.Show = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        Xrm.Navigation.openConfirmDialog({
                            text: _this._message,
                            title: _this._title
                        }).then(function () {
                            resolve(true);
                        }, function () {
                            reject();
                        });
                    });
                };
                CrmConfirmDialog.prototype.Destroy = function () {
                };
                return CrmConfirmDialog;
            }());
            Dialogs.CrmConfirmDialog = CrmConfirmDialog;
            var CrmDialogProvider = /** @class */ (function () {
                function CrmDialogProvider() {
                }
                CrmDialogProvider.prototype.Alert = function (message, title) {
                    return Promise.resolve(new CrmAlertDialog(message));
                };
                CrmDialogProvider.prototype.Confirm = function (message, title) {
                    return Promise.resolve(new CrmConfirmDialog(message, title));
                };
                CrmDialogProvider.prototype.Create = function (config) {
                    throw Error("Not supported.");
                };
                return CrmDialogProvider;
            }());
            Dialogs.CrmDialogProvider = CrmDialogProvider;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));