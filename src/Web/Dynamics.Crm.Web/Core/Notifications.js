var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Notifications;
            (function (Notifications) {
                "use strict";
                function show(message, id, level) {
                    if (level === void 0) { level = Dynamics.Crm.Forms.FormNotificationType.Information; }
                    Xrm.Page.ui.setFormNotification(message, level, id);
                }
                Notifications.show = show;
                function hide(id, afterSeconds) {
                    if (afterSeconds === void 0) { afterSeconds = null; }
                    if (_.isNumber(afterSeconds) && afterSeconds > 0) {
                        setTimeout(function () { return Xrm.Page.ui.clearFormNotification(id); }, afterSeconds * 1000);
                    }
                    else {
                        Xrm.Page.ui.clearFormNotification(id);
                    }
                }
                Notifications.hide = hide;
            })(Notifications = Forms.Notifications || (Forms.Notifications = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
