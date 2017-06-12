﻿module Notifications {

    "use strict";

    export class WebNotificationService implements INotificationService {

        private _permissionRequest: PromiseLike<NotificationPermission>;
        private _granted: boolean;

        init(): void {

            if (typeof Notification === "undefined") {
                throw new Error("Browser does not support web notifications.");
            }

            if (!this._permissionRequest) {

                this._permissionRequest = Notification
                    .requestPermission()
                    .then(this.requestPermissionFulfilled.bind(this), this.requestPermissionRejected.bind(this));
            }
        }

        show(title: string, content: string, icon?: string): void {

            if (this._granted) {

                this.createNotification(title, content, icon);

            } else if (this._permissionRequest) {

                this._permissionRequest
                    .then((permission: NotificationPermission) => {
                        if (permission !== "granted") {
                            return;
                        }
                        this.createNotification(title, content, icon);
                    });
            } else {
                throw new Error("WebNotificationService hasn't been initialized.");
            }
        }

        private createNotification(title: string, content: string, icon: string): void {

            if (!this._granted) {
                return;
            }

            var notification = new Notification(title, {
                body: content,
                icon: icon
            });
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