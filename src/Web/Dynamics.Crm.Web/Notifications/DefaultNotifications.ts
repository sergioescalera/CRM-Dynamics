module Notifications {

    "use strict";

    export class DefaultNotifications implements INotificationService {

        init(): void {
        }

        show(title: string, content: string, icon?: string): void {
            console.log(`${title}:${content}`);
        }
    }
}