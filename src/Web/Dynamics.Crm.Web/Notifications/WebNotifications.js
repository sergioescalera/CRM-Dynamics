var Notifications;
(function (Notifications) {
    "use strict";
    class WebNotificationService {
        init() {
            if (!this.test()) {
                throw new Error("Web browser does not support notifications.");
            }
            if (!this._permissionRequest) {
                this._permissionRequest = Notification
                    .requestPermission()
                    .then(this.requestPermissionFulfilled.bind(this), this.requestPermissionRejected.bind(this));
            }
        }
        hide(id) {
        }
        show(options) {
            if (this._granted) {
                this.createNotification(options.title, options.message, options.icon);
            }
            else if (this._permissionRequest) {
                this._permissionRequest
                    .then((permission) => {
                    if (permission !== "granted") {
                        return;
                    }
                    this.createNotification(options.title, options.message, options.icon);
                });
            }
            else {
                throw new Error("WebNotificationService hasn't been initialized.");
            }
        }
        test() {
            try {
                return _.isFunction(Notification)
                    && _.isFunction(Notification.requestPermission);
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        }
        createNotification(title, content, icon) {
            if (!this._granted) {
                return;
            }
            let notification = new Notification(title, {
                body: content,
                icon: icon
            });
            return notification;
        }
        requestPermissionFulfilled(permission) {
            console.log(`NotificationService.requestPermissionFulfilled(permission=${permission})`);
            this._granted = permission === "granted";
        }
        requestPermissionRejected(reason) {
            console.log(`NotificationService.requestPermissionRejected(reason=${reason})`);
        }
    }
    Notifications.WebNotificationService = WebNotificationService;
})(Notifications || (Notifications = {}));
