module Notifications {

    "use strict";

    export class DefaultNotifications implements NotificationService {

        init(): void {

            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }

        hide(id?: string): void {
        }

        show(options: NotificationServiceOptions): void {
            alert(options.message);
        }

        test(): boolean {

            return _.isFunction(alert);
        }
    }
}