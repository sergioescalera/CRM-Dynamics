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
