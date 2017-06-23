var Notifications;
(function (Notifications) {
    "use strict";
    var DefaultNotifications = (function () {
        function DefaultNotifications() {
        }
        DefaultNotifications.prototype.init = function () {
            if (!this.test()) {
                throw new Error("Not supported.");
            }
        };
        DefaultNotifications.prototype.show = function (options) {
            alert(options.message);
        };
        DefaultNotifications.prototype.test = function () {
            return _.isFunction(alert);
        };
        return DefaultNotifications;
    }());
    Notifications.DefaultNotifications = DefaultNotifications;
})(Notifications || (Notifications = {}));
