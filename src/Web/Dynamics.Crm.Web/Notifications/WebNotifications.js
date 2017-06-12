var Notifications;
(function (Notifications) {
    "use strict";
    var WebNotificationService = (function () {
        function WebNotificationService() {
        }
        WebNotificationService.prototype.init = function () {
            if (typeof Notification === "undefined") {
                throw new Error("Browser does not support web notifications.");
            }
            if (!this._permissionRequest) {
                this._permissionRequest = Notification
                    .requestPermission()
                    .then(this.requestPermissionFulfilled.bind(this), this.requestPermissionRejected.bind(this));
            }
        };
        WebNotificationService.prototype.show = function (title, content, icon) {
            var _this = this;
            if (this._granted) {
                this.createNotification(title, content, icon);
            }
            else if (this._permissionRequest) {
                this._permissionRequest
                    .then(function (permission) {
                    if (permission !== "granted") {
                        return;
                    }
                    _this.createNotification(title, content, icon);
                });
            }
            else {
                throw new Error("WebNotificationService hasn't been initialized.");
            }
        };
        WebNotificationService.prototype.createNotification = function (title, content, icon) {
            if (!this._granted) {
                return;
            }
            var notification = new Notification(title, {
                body: content,
                icon: icon
            });
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
