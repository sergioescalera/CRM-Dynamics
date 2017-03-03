var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            var BootstrapDialogTemplates = (function () {
                function BootstrapDialogTemplates() {
                }
                BootstrapDialogTemplates.alert = function (message, title) { return ("" +
                    "<div class='modal fade' tabindex='-1' role='dialog'>" +
                    "<div class='modal-dialog' role='document'>" +
                    "   <div class='modal-content'>" +
                    "       <div class='modal-header'>" +
                    "           <button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                    "               <span aria-hidden='true' >&times;</span></button>" +
                    "           <h4 class='modal-title'>{title}</h4>" +
                    "       </div>" +
                    "       <div class='modal-body'>{content}</div>" +
                    "       <div class='modal-footer'>" +
                    "           <button type='button' class='btn btn-primary' data-dismiss='modal'>OK</button>" +
                    "       </div>" +
                    "   </div>" +
                    "</div>" +
                    "</div>") // modal
                    .replace("{content}", message)
                    .replace("{title}", title); };
                BootstrapDialogTemplates.confirm = function (message, title) { return ("" +
                    "<div class='modal fade' tabindex='-1' role='dialog'>" +
                    "<div class='modal-dialog' role='document'>" +
                    "   <div class='modal-content'>" +
                    "       <div class='modal-header'>" +
                    "           <button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                    "               <span aria-hidden='true' >&times;</span></button>" +
                    "           <h4 class='modal-title'>{title}</h4>" +
                    "       </div>" +
                    "       <div class='modal-body'>{content}</div>" +
                    "       <div class='modal-footer'>" +
                    "           <button type='button' class='btn btn-primary' data-dismiss='modal'>OK</button>" +
                    "           <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
                    "       </div>" +
                    "   </div>" +
                    "</div>" +
                    "</div>") // modal
                    .replace("{content}", message)
                    .replace("{title}", title); };
                return BootstrapDialogTemplates;
            }());
            var BootstrapDialog = (function () {
                function BootstrapDialog(window, content) {
                    this._content = content;
                    this._window = window;
                }
                BootstrapDialog.prototype.Hide = function () {
                    debugger;
                    this.deferred.resolve();
                };
                BootstrapDialog.prototype.Show = function () {
                    this.dialog.modal("show");
                    return this.deferred;
                };
                Object.defineProperty(BootstrapDialog.prototype, "dialog", {
                    get: function () {
                        if (!this._dialog) {
                            this._dialog = this._window.jQuery(this._content);
                            this._dialog.appendTo(this._window.jQuery("body"));
                            this._dialog.modal({
                                backdrop: false,
                                show: false
                            });
                            this._dialog.on("hide.bs.modal", this.Hide.bind(this));
                        }
                        return this._dialog;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BootstrapDialog.prototype, "deferred", {
                    get: function () {
                        if (!this._deferred) {
                            this._deferred = $.Deferred();
                        }
                        return this._deferred;
                    },
                    enumerable: true,
                    configurable: true
                });
                return BootstrapDialog;
            }());
            Dialogs.BootstrapDialog = BootstrapDialog;
            var BootstrapDialogProvider = (function () {
                function BootstrapDialogProvider(window) {
                    this._window = window;
                    this.Init();
                }
                BootstrapDialogProvider.prototype.Init = function () {
                    var baseUrl = "../WebResources/{prefix}/Libs/bootstrap/"
                        .replace("{prefix}", Dynamics.Crm.publisherPrefix);
                    this._loading = Crm.ScriptManager.loadScript(baseUrl + "js/bootstrap.min.js", this._window.document);
                    Crm.ScriptManager.loadStylesheet(baseUrl + "css/bootstrap.min.css", this._window.document);
                };
                BootstrapDialogProvider.prototype.Alert = function (message, title) {
                    var _this = this;
                    return this
                        ._loading
                        .then(function () { return new BootstrapDialog(_this._window, BootstrapDialogTemplates.alert(message, title)); });
                };
                BootstrapDialogProvider.prototype.Confirm = function (message, title) {
                    var _this = this;
                    return this
                        ._loading
                        .then(function () { return new BootstrapDialog(_this._window, BootstrapDialogTemplates.confirm(message, title)); });
                };
                BootstrapDialogProvider.prototype.Create = function (config) {
                    var _this = this;
                    return this
                        ._loading
                        .then(function () { return new BootstrapDialog(_this._window, config.Template); });
                };
                return BootstrapDialogProvider;
            }());
            Dialogs.BootstrapDialogProvider = BootstrapDialogProvider;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
