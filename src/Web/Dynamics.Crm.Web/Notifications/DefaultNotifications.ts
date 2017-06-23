module Notifications {

    "use strict";

    export class DefaultNotifications implements INotificationService {

        init(): void {

            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }

        show(options: Options): void {
            alert(options.message);
        }

        test(): boolean {

            return _.isFunction(alert);
        }
    }
}