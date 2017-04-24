var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            var CrmAlertDialog = (function () {
                function CrmAlertDialog(window, message) {
                    this._window = window;
                    this._message = message;
                }
                CrmAlertDialog.prototype.Show = function () {
                    var deferred = this._window.$.Deferred();
                    Xrm.Utility.alertDialog(this._message, function () {
                        deferred.resolve();
                    });
                    return deferred;
                };
                CrmAlertDialog.prototype.Destroy = function () {
                };
                return CrmAlertDialog;
            }());
            Dialogs.CrmAlertDialog = CrmAlertDialog;
            var CrmConfirmDialog = (function () {
                function CrmConfirmDialog(window, message) {
                    this._window = window;
                    this._message = message;
                }
                CrmConfirmDialog.prototype.Show = function () {
                    var deferred = this._window.$.Deferred();
                    Xrm.Utility.confirmDialog(this._message, function () {
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
            var CrmDialogProvider = (function () {
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
                    deferred.resolve(new CrmConfirmDialog(this._window, message));
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
