var Notifications;
(function (Notifications) {
    "use strict";
    var CrmFormNotificationService = (function () {
        function CrmFormNotificationService() {
        }
        CrmFormNotificationService.prototype.hide = function (id) {
            Xrm.Page.ui.clearFormNotification(id);
        };
        CrmFormNotificationService.prototype.init = function () {
            if (!this.test()) {
                throw new Error("Not supported.");
            }
        };
        CrmFormNotificationService.prototype.show = function (options) {
            if (_.isFunction(Xrm.Page.ui.setFormHtmlNotification)) {
                Xrm.Page.ui.setFormHtmlNotification(options.message, options.type, options.id);
            }
            else {
                Xrm.Page.ui.setFormNotification(options.message, options.type, options.id);
            }
        };
        CrmFormNotificationService.prototype.test = function () {
            try {
                return typeof Xrm !== "undefined"
                    && !!Xrm
                    && !!Xrm.Page
                    && !!Xrm.Page.ui
                    && _.isFunction(Xrm.Page.ui.setFormNotification);
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        };
        return CrmFormNotificationService;
    }());
    Notifications.CrmFormNotificationService = CrmFormNotificationService;
})(Notifications || (Notifications = {}));
