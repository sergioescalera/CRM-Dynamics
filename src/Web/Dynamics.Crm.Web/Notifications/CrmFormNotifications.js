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
            return !_.isUndefined(Xrm) && !_.isNull(Xrm)
                && !_.isUndefined(Xrm.Page) && !_.isNull(Xrm.Page)
                && !_.isUndefined(Xrm.Page.ui) && !_.isNull(Xrm.Page.ui)
                && _.isFunction(Xrm.Page.ui.setFormNotification);
        };
        return CrmFormNotificationService;
    }());
    Notifications.CrmFormNotificationService = CrmFormNotificationService;
})(Notifications || (Notifications = {}));
