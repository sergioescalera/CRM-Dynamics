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
                BootstrapDialogTemplates.alert = function (message, title) { return ("\n            <div class='modal fade' tabindex='-1' role='dialog'>\n            <div class='modal-dialog' role='document'>\n               <div class='modal-content'>\n                   <div class='modal-header'>\n                       <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\n                           <span aria-hidden='true' >&times;</span></button>\n                       <h4 class='modal-title'>" + title + "</h4>\n                   </div>\n                   <div class='modal-body'>" + message + "</div>\n                   <div class='modal-footer'>\n                       <button type='button' class='btn btn-primary' data-dismiss='modal'>OK</button>\n                   </div>\n               </div>\n            </div>\n            </div>"); };
                BootstrapDialogTemplates.confirm = function (message, title) { return ("\n            <div class='modal fade' tabindex='-1' role='dialog'>\n            <div class='modal-dialog' role='document'>\n               <div class='modal-content'>\n                   <div class='modal-header'>\n                       <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\n                           <span aria-hidden='true' >&times;</span></button>\n                       <h4 class='modal-title'>" + title + "</h4>\n                   </div>\n                   <div class='modal-body'>" + message + "</div>\n                   <div class='modal-footer'>\n                       <button type='button' class='btn btn-primary' data-dismiss='modal'>OK</button>\n                       <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>\n                   </div>\n               </div>\n            </div>\n            </div>"); };
                return BootstrapDialogTemplates;
            }());
            var BootstrapDialog = (function () {
                function BootstrapDialog(window, content, init) {
                    this._content = content;
                    this._window = window;
                    this._init = init;
                }
                BootstrapDialog.prototype.Resolve = function () {
                    this.deferred.resolve();
                };
                BootstrapDialog.prototype.Reject = function () {
                    this.deferred.reject();
                };
                BootstrapDialog.prototype.Show = function () {
                    this.dialog.modal("show");
                    return this.deferred;
                };
                BootstrapDialog.prototype.Destroy = function () {
                    if (this._dialog) {
                        this._dialog.remove();
                    }
                };
                Object.defineProperty(BootstrapDialog.prototype, "dialog", {
                    get: function () {
                        if (!this._dialog) {
                            this._dialog = this._window.$(this._content);
                            this._dialog.appendTo(this._window.$("body"));
                            this._dialog.modal({
                                backdrop: false,
                                show: false
                            });
                            this._window.$("button.btn-primary", this._dialog).click(this.Resolve.bind(this));
                            this._window.$("button.close", this._dialog).click(this.Reject.bind(this));
                            this._window.$("button.btn-default", this._dialog).click(this.Reject.bind(this));
                            if (this._init) {
                                this._init(this._dialog);
                            }
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
                    var baseUrl = "../WebResources/" + Dynamics.Crm.publisherPrefix + "/Libs/bootstrap/";
                    this._loading = Crm.ScriptManager.loadScript(baseUrl + "js/bootstrap.min.js", this._window);
                    Crm.ScriptManager.loadStylesheet(baseUrl + "css/bootstrap.min.css", this._window);
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
                        .then(function () { return new BootstrapDialog(_this._window, config.Template, config.Init); });
                };
                return BootstrapDialogProvider;
            }());
            Dialogs.BootstrapDialogProvider = BootstrapDialogProvider;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
