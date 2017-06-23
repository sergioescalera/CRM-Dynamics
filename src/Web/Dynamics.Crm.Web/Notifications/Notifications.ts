module Notifications {

    "use strict";

    export var services: INotificationService[] = [
        new CrmFormNotificationService(),
        new WebNotificationService(),
        new ToastrNotificationService(),
        new DefaultNotifications()
    ];
    var notifications: INotificationService;

    export function show(options: Options): void {

        console.log("Notifications.show()");

        if (!notifications) {
            notifications = resolveNotificationService();
            notifications.init();
        }

        notifications.show(options || {
            message: ""
        });
    }

    function resolveNotificationService(): INotificationService {

        for (var i: number = 0; i < services.length; i++) {
            var service: INotificationService = services[i];
            if (service && service.test()) {
                return service;
            }
        }
        throw new Error("Unable to resolve notification service");
    }
}