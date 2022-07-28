var Notifications;
(function (Notifications) {
    "use strict";
    class DefaultNotifications {
        init() {
            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }
        hide(id) {
        }
        show(options) {
            try {
                Xrm.Navigation.openAlertDialog({
                    text: options.message
                });
            }
            catch (e) {
                alert(options.message);
                console.warn(e);
            }
        }
        test() {
            try {
                return (typeof Xrm !== "undefined"
                    && !!Xrm
                    && !!Xrm.Navigation
                    && !!Xrm.Navigation.openAlertDialog)
                    || typeof alert === "function";
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        }
    }
    Notifications.DefaultNotifications = DefaultNotifications;
})(Notifications || (Notifications = {}));
