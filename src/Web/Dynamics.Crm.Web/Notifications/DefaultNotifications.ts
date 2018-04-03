module Notifications {

    "use strict";

    export class DefaultNotifications implements NotificationService {

        init(): void {

            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }

        hide(id?: string): void {
        }

        show(options: NotificationServiceOptions): void {
            try {
                Xrm.Navigation.openAlertDialog({
                    text: options.message
                });
            } catch (e) {
                alert(options.message);
                console.warn(e);
            }
        }

        test(): boolean {

            try {
                return (typeof Xrm !== "undefined"
                    && !!Xrm
                    && !!Xrm.Navigation
                    && !!Xrm.Navigation.openAlertDialog)
                    || typeof alert === "function";
            } catch (e) {
                console.warn(e);
                return false;
            }
        }
    }
}