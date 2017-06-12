var Notifications;
(function (Notifications) {
    "use strict";
    var DefaultNotifications = (function () {
        function DefaultNotifications() {
        }
        DefaultNotifications.prototype.init = function () {
        };
        DefaultNotifications.prototype.show = function (title, content, icon) {
            console.log(title + ":" + content);
        };
        return DefaultNotifications;
    }());
    Notifications.DefaultNotifications = DefaultNotifications;
})(Notifications || (Notifications = {}));
