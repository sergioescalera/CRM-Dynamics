module Notifications {

    "use strict";

    export class ToastrNotificationService implements NotificationService {

        init(): void {
            if (!this.test) {
                throw new Error("Not supported");
            }
            Dynamics.Crm.ScriptManager.loadStylesheet(
                "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css",
                <JQueryWindow>window);
        }

        hide(): void {
            toastr.clear();
        }

        show(options: NotificationServiceOptions): void {
            var str: string = options.type.toLowerCase();
            if (toastr[str]) {
                toastr[str](options.message, options.title);
            } else {
                toastr.info(options.message, options.title);
            }
        }

        test(): boolean {

            return !_.isUndefined(toastr);
        }
    }
}