var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            var CrmAlertDialog = /** @class */ (function () {
                function CrmAlertDialog(window, message) {
                    this._window = window;
                    this._message = message;
                }
                CrmAlertDialog.prototype.Show = function () {
                    var deferred = this._window.$.Deferred();
                    Xrm.Navigation
                        .openAlertDialog({
                        text: this._message
                    }).then(function () { return deferred.resolve(); });
                    return deferred;
                };
                CrmAlertDialog.prototype.Destroy = function () {
                };
                return CrmAlertDialog;
            }());
            Dialogs.CrmAlertDialog = CrmAlertDialog;
            var CrmConfirmDialog = /** @class */ (function () {
                function CrmConfirmDialog(window, message, title) {
                    this._window = window;
                    this._message = message;
                    this._title = title;
                }
                CrmConfirmDialog.prototype.Show = function () {
                    var deferred = this._window.$.Deferred();
                    Xrm.Navigation.openConfirmDialog({
                        text: this._message,
                        title: this._title
                    }).then(function () {
                        deferred.resolve(true);
                    }, function () {
                        deferred.reject();
                    });
                    return deferred;
                };
                CrmConfirmDialog.prototype.Destroy = function () {
                };
                return CrmConfirmDialog;
            }());
            Dialogs.CrmConfirmDialog = CrmConfirmDialog;
            var CrmDialogProvider = /** @class */ (function () {
                function CrmDialogProvider(window) {
                    this._window = window;
                }
                CrmDialogProvider.prototype.Alert = function (message, title) {
                    var deferred = this._window.$.Deferred();
                    deferred.resolve(new CrmAlertDialog(this._window, message));
                    return deferred;
                };
                CrmDialogProvider.prototype.Confirm = function (message, title) {
                    var deferred = this._window.$.Deferred();
                    deferred.resolve(new CrmConfirmDialog(this._window, message, title));
                    return deferred;
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
