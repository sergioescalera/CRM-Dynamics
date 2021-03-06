var Notifications;
(function (Notifications) {
    "use strict";
    var DefaultNotifications = /** @class */ (function () {
        function DefaultNotifications() {
        }
        DefaultNotifications.prototype.init = function () {
            if (!this.test()) {
                throw new Error("Not supported.");
            }
        };
        DefaultNotifications.prototype.hide = function (id) {
        };
        DefaultNotifications.prototype.show = function (options) {
            try {
                Xrm.Navigation.openAlertDialog({
                    text: options.message
                });
            }
            catch (e) {
                alert(options.message);
                console.warn(e);
            }
        };
        DefaultNotifications.prototype.test = function () {
            try {
                return (typeof Xrm !== "undefined"
                    && !!Xrm
                    && !!Xrm.Navigation
                    && !!Xrm.Navigation.openAlertDialog)
                    || typeof alert === "function";
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        };
        return DefaultNotifications;
    }());
    Notifications.DefaultNotifications = DefaultNotifications;
})(Notifications || (Notifications = {}));
