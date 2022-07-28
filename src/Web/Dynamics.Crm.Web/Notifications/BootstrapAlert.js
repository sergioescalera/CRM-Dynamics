var Notifications;
(function (Notifications) {
    "use strict";
    let $notificationWrapper;
    class BoostrapAlert {
        init() {
            $notificationWrapper = $notificationWrapper || $("#notification-wrapper");
            if (!$notificationWrapper.get(0)) {
                $notificationWrapper = $(`<div id="notification-wrapper" class="hidden"></div>`);
                $notificationWrapper.prependTo(document.body);
            }
        }
        show(options) {
            let dismissible = !!options.dismissible;
            let message = options.message;
            let type = options.type;
            $notificationWrapper
                .removeClass("hidden")
                .html(`
<div class="alert alert-${type} ${(dismissible ? "alert-dismissible" : "")}" id="notification" role="alert">
    ${(dismissible ? `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>` : "")}
    <p>${message}</p>
</div>`);
        }
        hide() {
            $notificationWrapper.addClass("hidden");
        }
        test() {
            return true;
        }
    }
    Notifications.BoostrapAlert = BoostrapAlert;
})(Notifications || (Notifications = {}));
