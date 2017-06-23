var Notifications;
(function (Notifications) {
    "use strict";
    Notifications.services = [
        new Notifications.CrmFormNotificationService(),
        new Notifications.WebNotificationService(),
        new Notifications.ToastrNotificationService(),
        new Notifications.DefaultNotifications()
    ];
    var notifications;
    function show(options) {
        console.log("Notifications.show()");
        if (!notifications) {
            notifications = resolveNotificationService();
            notifications.init();
        }
        notifications.show(options || {
            message: ""
        });
    }
    Notifications.show = show;
    function resolveNotificationService() {
        for (var i = 0; i < Notifications.services.length; i++) {
            var service = Notifications.services[i];
            if (service && service.test()) {
                return service;
            }
        }
        throw new Error("Unable to resolve notification service");
    }
})(Notifications || (Notifications = {}));
