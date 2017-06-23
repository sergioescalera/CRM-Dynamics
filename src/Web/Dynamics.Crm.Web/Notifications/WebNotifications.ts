module Notifications {

    "use strict";

    export class WebNotificationService implements INotificationService {

        private _permissionRequest: PromiseLike<NotificationPermission>;
        private _granted: boolean;

        init(): void {

            if (!this.test()) {
                throw new Error("Web browser does not support notifications.");
            }

            if (!this._permissionRequest) {

                this._permissionRequest = Notification
                    .requestPermission()
                    .then(this.requestPermissionFulfilled.bind(this), this.requestPermissionRejected.bind(this));
            }
        }

        show(options: Options): void {

            if (this._granted) {

                this.createNotification(options.title, options.message, options.icon);

            } else if (this._permissionRequest) {

                this._permissionRequest
                    .then((permission: NotificationPermission) => {
                        if (permission !== "granted") {
                            return;
                        }
                        this.createNotification(options.title, options.message, options.icon);
                    });
            } else {
                throw new Error("WebNotificationService hasn't been initialized.");
            }
        }

        test(): boolean {

            return _.isFunction(Notification)
                && _.isString(Notification.permission)
                && _.isFunction(Notification.requestPermission)
                && Notification.permission !== "denied";
        }

        private createNotification(title: string, content: string, icon: string): Notification {

            if (!this._granted) {
                return;
            }

            var notification: Notification = new Notification(title, {
                body: content,
                icon: icon
            });

            return notification;
        }

        private requestPermissionFulfilled(permission: NotificationPermission): void {

            console.log(`NotificationService.requestPermissionFulfilled(permission=${permission})`);

            this._granted = permission === "granted";
        }

        private requestPermissionRejected(reason: any): void {

            console.log(`NotificationService.requestPermissionRejected(reason=${reason})`);
        }
    }
}