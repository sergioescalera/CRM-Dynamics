var Notifications;
(function (Notifications) {
    "use strict";
    var ToastrNotificationService = (function () {
        function ToastrNotificationService() {
        }
        ToastrNotificationService.prototype.init = function () {
            if (!this.test) {
                throw new Error("Not supported");
            }
            Dynamics.Crm.ScriptManager.loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css", window);
        };
        ToastrNotificationService.prototype.hide = function () {
            toastr.clear();
        };
        ToastrNotificationService.prototype.show = function (options) {
            var str = options.type.toLowerCase();
            if (toastr[str]) {
                toastr[str](options.message, options.title);
            }
            else {
                toastr.info(options.message, options.title);
            }
        };
        ToastrNotificationService.prototype.test = function () {
            return !_.isUndefined(toastr);
        };
        return ToastrNotificationService;
    }());
    Notifications.ToastrNotificationService = ToastrNotificationService;
})(Notifications || (Notifications = {}));
