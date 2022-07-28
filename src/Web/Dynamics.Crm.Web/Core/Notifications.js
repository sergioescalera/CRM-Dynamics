var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        let undefinedstr = "undefined";
        class Notifications {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            show(message, id, level = Dynamics.Crm.FormNotificationTypes.Information) {
                this.page.ui.setFormNotification(message, level, id);
            }
            showHtml(message, id, level = Dynamics.Crm.FormNotificationTypes.Information) {
                if (typeof this.page.ui.setFormHtmlNotification === "function") {
                    this.page.ui.setFormHtmlNotification(message, level, id);
                }
                else {
                    this.page.ui.setFormNotification(Crm.Utility.htmlToText(message), level, id);
                }
            }
            hide(id, afterSeconds = null) {
                if (_.isNumber(afterSeconds) && afterSeconds > 0) {
                    setTimeout(() => this.page.ui.clearFormNotification(id), afterSeconds * 1000);
                }
                else {
                    this.page.ui.clearFormNotification(id);
                }
            }
            htmlSupported() {
                if (typeof Xrm !== undefinedstr &&
                    typeof this.page !== undefinedstr &&
                    typeof this.page.ui !== undefinedstr &&
                    typeof this.page.ui.setFormHtmlNotification !== undefinedstr) {
                    return true;
                }
                return false;
            }
            supported() {
                if (typeof Xrm !== undefinedstr &&
                    typeof this.page !== undefinedstr &&
                    typeof this.page.ui !== undefinedstr &&
                    typeof this.page.ui.setFormNotification !== undefinedstr &&
                    typeof this.page.ui.clearFormNotification !== undefinedstr) {
                    return true;
                }
                return false;
            }
        }
        Crm.Notifications = Notifications;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
