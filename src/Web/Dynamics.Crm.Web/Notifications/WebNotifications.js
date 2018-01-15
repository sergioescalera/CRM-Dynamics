var Notifications;
(function (Notifications) {
    "use strict";
    var WebNotificationService = (function () {
        function WebNotificationService() {
        }
        WebNotificationService.prototype.init = function () {
            if (!this.test()) {
                throw new Error("Web browser does not support notifications.");
            }
            if (!this._permissionRequest) {
                this._permissionRequest = Notification
                    .requestPermission()
                    .then(this.requestPermissionFulfilled.bind(this), this.requestPermissionRejected.bind(this));
            }
        };
        WebNotificationService.prototype.hide = function (id) {
        };
        WebNotificationService.prototype.show = function (options) {
            var _this = this;
            if (this._granted) {
                this.createNotification(options.title, options.message, options.icon);
            }
            else if (this._permissionRequest) {
                this._permissionRequest
                    .then(function (permission) {
                    if (permission !== "granted") {
                        return;
                    }
                    _this.createNotification(options.title, options.message, options.icon);
                });
            }
            else {
                throw new Error("WebNotificationService hasn't been initialized.");
            }
        };
        WebNotificationService.prototype.test = function () {
            return _.isFunction(Notification)
                && _.isString(Notification.permission)
                && _.isFunction(Notification.requestPermission)
                && Notification.permission !== "denied";
        };
        WebNotificationService.prototype.createNotification = function (title, content, icon) {
            if (!this._granted) {
                return;
            }
            var notification = new Notification(title, {
                body: content,
                icon: icon
            });
            return notification;
        };
        WebNotificationService.prototype.requestPermissionFulfilled = function (permission) {
            console.log("NotificationService.requestPermissionFulfilled(permission=" + permission + ")");
            this._granted = permission === "granted";
        };
        WebNotificationService.prototype.requestPermissionRejected = function (reason) {
            console.log("NotificationService.requestPermissionRejected(reason=" + reason + ")");
        };
        return WebNotificationService;
    }());
    Notifications.WebNotificationService = WebNotificationService;
})(Notifications || (Notifications = {}));
