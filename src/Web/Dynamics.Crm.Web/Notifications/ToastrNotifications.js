var Notifications;
(function (Notifications) {
    "use strict";
    class ToastrNotificationService {
        init() {
            if (!this.test()) {
                throw new Error("Not supported");
            }
            Dynamics.Crm.ScriptManager.loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css", window);
        }
        hide() {
            toastr.clear();
        }
        show(options) {
            let str = options.type.toLowerCase();
            if (toastr[str]) {
                toastr[str](options.message, options.title);
            }
            else {
                toastr.info(options.message, options.title);
            }
        }
        test() {
            try {
                return typeof $ === "function"
                    && _.isObject($.fn)
                    && _.isString($.fn.jquery)
                    && _.isObject(toastr);
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        }
    }
    Notifications.ToastrNotificationService = ToastrNotificationService;
})(Notifications || (Notifications = {}));
