var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        Crm.publisherPrefix = "ts4_";
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            var FormNotificationType = (function () {
                function FormNotificationType() {
                }
                FormNotificationType.Error = "ERROR";
                FormNotificationType.Warning = "WARNING";
                FormNotificationType.Information = "INFO";
                return FormNotificationType;
            }());
            Forms.FormNotificationType = FormNotificationType;
            var ClientType = (function () {
                function ClientType() {
                }
                ClientType.Browser = "Web";
                ClientType.Outlook = "Outlook";
                ClientType.Mobile = "Mobile";
                return ClientType;
            }());
            Forms.ClientType = ClientType;
            var AttributeRequiredLevel = (function () {
                function AttributeRequiredLevel() {
                }
                AttributeRequiredLevel.None = "none";
                AttributeRequiredLevel.Required = "required";
                AttributeRequiredLevel.Recommended = "recommended";
                return AttributeRequiredLevel;
            }());
            Forms.AttributeRequiredLevel = AttributeRequiredLevel;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Constants.js.map
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var ScriptManager;
        (function (ScriptManager) {
            "use strict";
            var _scripts = {};
            var _stylesheets = [];
            function loadScripts(scripts, document) {
                if (document === void 0) { document = window.document; }
                var deferreds = scripts.map(function (s) { return loadScript(s, document); });
                return jQuery.when(deferreds);
            }
            ScriptManager.loadScripts = loadScripts;
            function loadScript(script, document) {
                console.log("Dynamics.Crm.ScriptManager.loadScript: " + script);
                var promise = _scripts[script];
                if (!!promise) {
                    return promise;
                }
                _scripts[script] = promise = jQuery.Deferred();
                var element = document.createElement("script");
                element.defer = true;
                element.type = "text/javascript";
                element.src = script;
                element.addEventListener("load", function onLoaded() {
                    promise.resolveWith(element);
                });
                document.body.appendChild(element);
                return promise;
            }
            ScriptManager.loadScript = loadScript;
            function loadStylesheets(stylesheets, document) {
                if (document === void 0) { document = window.document; }
                stylesheets.forEach(function (s) { return loadStylesheet(s, document); });
            }
            ScriptManager.loadStylesheets = loadStylesheets;
            function loadStylesheet(stylesheet, document) {
                console.log("Dynamics.Crm.ScriptManager.loadStylesheet: " + stylesheet);
                var filter = _stylesheets.filter(function (s) { return s === stylesheet; });
                if (filter.length === 0) {
                    jQuery("head", document)
                        .append("<link rel='stylesheet' href='{path}' />"
                        .replace("{path}", stylesheet));
                    _stylesheets.push(stylesheet);
                }
            }
            ScriptManager.loadStylesheet = loadStylesheet;
        })(ScriptManager = Crm.ScriptManager || (Crm.ScriptManager = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=ScriptManager.js.map
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
//# sourceMappingURL=BootstrapDialogs.js.map
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            (function (DialogType) {
                DialogType[DialogType["Alert"] = 0] = "Alert";
                DialogType[DialogType["Confirm"] = 1] = "Confirm";
                DialogType[DialogType["Custom"] = 2] = "Custom";
            })(Dialogs.DialogType || (Dialogs.DialogType = {}));
            var DialogType = Dialogs.DialogType;
            var provider;
            function getProvider() {
                if (!provider) {
                    provider = new Dialogs.BootstrapDialogProvider(window.top);
                }
                return provider;
            }
            function alert(message, title) {
                var deferred = $.Deferred();
                getProvider()
                    .Alert(message, title)
                    .done(function (d) { return d
                    .Show()
                    .done(function () { return deferred.resolve(); })
                    .fail(function () { return deferred.reject(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.alert = alert;
            function confirm(message, title) {
                var deferred = $.Deferred();
                getProvider()
                    .Confirm(message, title)
                    .done(function (d) { return d
                    .Show()
                    .done(function (r) { return deferred.resolve(r); })
                    .fail(function () { return deferred.reject(); }); })
                    .fail(function () { return deferred.reject(); });
                return deferred;
            }
            Dialogs.confirm = confirm;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Dialogs.js.map