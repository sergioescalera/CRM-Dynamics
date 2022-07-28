var Notifications;
(function (Notifications) {
    "use strict";
    class CrmFormNotificationService {
        hide(id) {
            Xrm["Page"].ui.clearFormNotification(id);
        }
        init() {
            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }
        show(options) {
            if (_.isFunction(Xrm["Page"].ui.setFormHtmlNotification)) {
                Xrm["Page"].ui.setFormHtmlNotification(options.message, options.type, options.id);
            }
            else {
                Xrm["Page"].ui.setFormNotification(options.message, options.type, options.id);
            }
        }
        test() {
            try {
                return typeof Xrm !== "undefined"
                    && !!Xrm
                    && !!Xrm["Page"]
                    && !!Xrm["Page"].ui
                    && _.isFunction(Xrm["Page"].ui.setFormNotification);
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        }
    }
    Notifications.CrmFormNotificationService = CrmFormNotificationService;
})(Notifications || (Notifications = {}));
