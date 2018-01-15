var Notifications;
(function (Notifications) {
    "use strict";
    var $notificationWrapper;
    var BoostrapAlert = (function () {
        function BoostrapAlert() {
        }
        BoostrapAlert.prototype.init = function () {
            $notificationWrapper = $notificationWrapper || $("#notification-wrapper");
            if (!$notificationWrapper.get(0)) {
                $notificationWrapper = $("<div id=\"notification-wrapper\" class=\"hidden\"></div>");
                $notificationWrapper.prependTo(document.body);
            }
        };
        BoostrapAlert.prototype.show = function (options) {
            var dismissible = !!options.dismissible;
            var message = options.message;
            var type = options.type;
            $notificationWrapper
                .removeClass("hidden")
                .html("\n<div class=\"alert alert-" + type + " " + (dismissible ? "alert-dismissible" : "") + "\" id=\"notification\" role=\"alert\">\n    " + (dismissible ? "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n    </button>" : "") + "\n    <p>" + message + "</p>\n</div>");
        };
        BoostrapAlert.prototype.hide = function () {
            $notificationWrapper.addClass("hidden");
        };
        BoostrapAlert.prototype.test = function () {
            return true;
        };
        return BoostrapAlert;
    }());
    Notifications.BoostrapAlert = BoostrapAlert;
})(Notifications || (Notifications = {}));
