module Notifications {

    "use strict";

    export class CrmFormNotificationService implements NotificationService {

        hide(id: string): void {

            Xrm.Page.ui.clearFormNotification(id);
        }

        init(): void {

            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }

        show(options: NotificationServiceOptions): void {

            if (_.isFunction(Xrm.Page.ui.setFormHtmlNotification)) {
                Xrm.Page.ui.setFormHtmlNotification(options.message, options.type, options.id);
            } else {
                Xrm.Page.ui.setFormNotification(options.message, options.type, options.id);
            }
        }

        test(): boolean {

            try {
                return typeof Xrm !== "undefined"
                    && !!Xrm
                    && !!Xrm.Page
                    && !!Xrm.Page.ui
                    && _.isFunction(Xrm.Page.ui.setFormNotification);
            }
            catch (e) {
                console.warn(e);
                return false;
            }
        }
    }
}