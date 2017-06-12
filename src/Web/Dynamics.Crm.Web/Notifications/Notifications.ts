module Notifications {

    "use strict";

    var notifications: INotificationService;

    export function show(title: string, content: string, icon?: string): void {

        console.log("Notifications.show()");

        if (!notifications) {
            notifications = resolveNotificationService();
        }

        notifications.show(title, content, icon);
    }

    function resolveNotificationService(): INotificationService {

        if (typeof Notification === "undefined") {
            console.warn("This browser does not support system notifications");
            return new DefaultNotifications();
        } else if (Notification.permission === "denied") {
            console.warn("User has denied browser notifications");
            return new DefaultNotifications();
        } else {
            return new WebNotificationService();
        }
    }
}