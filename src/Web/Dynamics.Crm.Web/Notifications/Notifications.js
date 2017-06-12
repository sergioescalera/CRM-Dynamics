var Notifications;
(function (Notifications) {
    "use strict";
    var notifications;
    function show(title, content, icon) {
        console.log("Notifications.show()");
        if (!notifications) {
            notifications = resolveNotificationService();
        }
        notifications.show(title, content, icon);
    }
    Notifications.show = show;
    function resolveNotificationService() {
        if (typeof Notification === "undefined") {
            console.warn("This browser does not support system notifications");
            return new Notifications.DefaultNotifications();
        }
        else if (Notification.permission === "denied") {
            console.warn("User has denied browser notifications");
            return new Notifications.DefaultNotifications();
        }
        else {
            return new Notifications.WebNotificationService();
        }
    }
})(Notifications || (Notifications = {}));
