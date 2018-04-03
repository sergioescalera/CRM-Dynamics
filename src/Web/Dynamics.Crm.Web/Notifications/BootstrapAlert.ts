module Notifications {

    "use strict";

    let $notificationWrapper: JQuery;

    export class BoostrapAlert implements NotificationService {

        init(): void {

            $notificationWrapper = $notificationWrapper || $("#notification-wrapper");

            if (!$notificationWrapper.get(0)) {

                $notificationWrapper = $(`<div id="notification-wrapper" class="hidden"></div>`);

                $notificationWrapper.prependTo(document.body);
            }
        }

        show(options: NotificationServiceOptions): void {

            let dismissible: boolean = !!options.dismissible;
            let message: string = options.message;
            let type: string = options.type;

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

        hide(): void {

            $notificationWrapper.addClass("hidden");
        }

        test(): boolean {

            return true;
        }
    }
}