var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Notifications;
            (function (Notifications) {
                "use strict";
                var undefinedstr = "undefined";
                function show(message, id, level) {
                    if (level === void 0) { level = Dynamics.Crm.Forms.FormNotificationType.Information; }
                    Xrm.Page.ui.setFormNotification(message, level, id);
                }
                Notifications.show = show;
                function showHtml(message, id, level) {
                    if (level === void 0) { level = Dynamics.Crm.Forms.FormNotificationType.Information; }
                    if (typeof Xrm.Page.ui.setFormHtmlNotification === "function") {
                        Xrm.Page.ui.setFormHtmlNotification(message, level, id);
                    }
                    else {
                        Xrm.Page.ui.setFormNotification(Crm.Utility.htmlToText(message), level, id);
                    }
                }
                Notifications.showHtml = showHtml;
                function hide(id, afterSeconds) {
                    if (afterSeconds === void 0) { afterSeconds = null; }
                    if (_.isNumber(afterSeconds) && afterSeconds > 0) {
                        setTimeout(function () { return Xrm.Page.ui.clearFormNotification(id); }, afterSeconds * 1000);
                    }
                    else {
                        Xrm.Page.ui.clearFormNotification(id);
                    }
                }
                Notifications.hide = hide;
                function htmlSupported() {
                    if (typeof Xrm !== undefinedstr &&
                        typeof Xrm.Page !== undefinedstr &&
                        typeof Xrm.Page.ui !== undefinedstr &&
                        typeof Xrm.Page.ui.setFormHtmlNotification !== undefinedstr) {
                        return true;
                    }
                    return false;
                }
                Notifications.htmlSupported = htmlSupported;
                function supported() {
                    if (typeof Xrm !== undefinedstr &&
                        typeof Xrm.Page !== undefinedstr &&
                        typeof Xrm.Page.ui !== undefinedstr &&
                        typeof Xrm.Page.ui.setFormNotification !== undefinedstr &&
                        typeof Xrm.Page.ui.clearFormNotification !== undefinedstr) {
                        return true;
                    }
                    return false;
                }
                Notifications.supported = supported;
            })(Notifications = Forms.Notifications || (Forms.Notifications = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
