var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            class CrmAlertDialog {
                constructor(message) {
                    this._message = message;
                }
                Show() {
                    return new Promise((resolve, reject) => {
                        Xrm.Navigation
                            .openAlertDialog({
                            confirmButtonLabel: "Ok",
                            text: this._message
                        }).then(() => resolve());
                    });
                }
                Destroy() {
                }
            }
            Dialogs.CrmAlertDialog = CrmAlertDialog;
            class CrmConfirmDialog {
                constructor(message, title) {
                    this._message = message;
                    this._title = title;
                }
                Show() {
                    return new Promise((resolve, reject) => {
                        Xrm.Navigation.openConfirmDialog({
                            text: this._message,
                            title: this._title
                        }).then(() => {
                            resolve(true);
                        }, () => {
                            reject();
                        });
                    });
                }
                Destroy() {
                }
            }
            Dialogs.CrmConfirmDialog = CrmConfirmDialog;
            class CrmDialogProvider {
                Alert(message, title) {
                    return Promise.resolve(new CrmAlertDialog(message));
                }
                Confirm(message, title) {
                    return Promise.resolve(new CrmConfirmDialog(message, title));
                }
                Create(config) {
                    throw Error("Not supported.");
                }
            }
            Dialogs.CrmDialogProvider = CrmDialogProvider;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
