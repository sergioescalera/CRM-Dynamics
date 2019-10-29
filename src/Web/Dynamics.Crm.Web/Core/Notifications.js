var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var undefinedstr = "undefined";
        var Notifications = /** @class */ (function () {
            function Notifications(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            Notifications.prototype.show = function (message, id, level) {
                if (level === void 0) { level = Dynamics.Crm.FormNotificationTypes.Information; }
                this.page.ui.setFormNotification(message, level, id);
            };
            Notifications.prototype.showHtml = function (message, id, level) {
                if (level === void 0) { level = Dynamics.Crm.FormNotificationTypes.Information; }
                if (typeof this.page.ui.setFormHtmlNotification === "function") {
                    this.page.ui.setFormHtmlNotification(message, level, id);
                }
                else {
                    this.page.ui.setFormNotification(Crm.Utility.htmlToText(message), level, id);
                }
            };
            Notifications.prototype.hide = function (id, afterSeconds) {
                var _this = this;
                if (afterSeconds === void 0) { afterSeconds = null; }
                if (_.isNumber(afterSeconds) && afterSeconds > 0) {
                    setTimeout(function () { return _this.page.ui.clearFormNotification(id); }, afterSeconds * 1000);
                }
                else {
                    this.page.ui.clearFormNotification(id);
                }
            };
            Notifications.prototype.htmlSupported = function () {
                if (typeof Xrm !== undefinedstr &&
                    typeof this.page !== undefinedstr &&
                    typeof this.page.ui !== undefinedstr &&
                    typeof this.page.ui.setFormHtmlNotification !== undefinedstr) {
                    return true;
                }
                return false;
            };
            Notifications.prototype.supported = function () {
                if (typeof Xrm !== undefinedstr &&
                    typeof this.page !== undefinedstr &&
                    typeof this.page.ui !== undefinedstr &&
                    typeof this.page.ui.setFormNotification !== undefinedstr &&
                    typeof this.page.ui.clearFormNotification !== undefinedstr) {
                    return true;
                }
                return false;
            };
            return Notifications;
        }());
        Crm.Notifications = Notifications;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
