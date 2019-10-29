module Dynamics.Crm {

    "use strict";

    let undefinedstr: string = "undefined";

    export class Notifications {

        protected page: FormContext;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
        }

        show(
            message: string,
            id: string,
            level: FormNotificationType = Dynamics.Crm.FormNotificationTypes.Information): void {

            this.page.ui.setFormNotification(message, level, id);
        }

        showHtml(
            message: string,
            id: string,
            level: FormNotificationType = Dynamics.Crm.FormNotificationTypes.Information): void {

            if (typeof this.page.ui.setFormHtmlNotification === "function") {

                this.page.ui.setFormHtmlNotification(message, level, id);

            } else {

                this.page.ui.setFormNotification(Utility.htmlToText(message), level, id);
            }
        }

        hide(id: string, afterSeconds: number = null): void {

            if (_.isNumber(afterSeconds) && afterSeconds > 0) {

                setTimeout(() => this.page.ui.clearFormNotification(id), afterSeconds * 1000);

            } else {

                this.page.ui.clearFormNotification(id);
            }
        }

        htmlSupported(): boolean {

            if (typeof Xrm !== undefinedstr &&
                typeof this.page !== undefinedstr &&
                typeof this.page.ui !== undefinedstr &&
                typeof this.page.ui.setFormHtmlNotification !== undefinedstr) {

                return true;
            }

            return false;
        }

        supported(): boolean {

            if (typeof Xrm !== undefinedstr &&
                typeof this.page !== undefinedstr &&
                typeof this.page.ui !== undefinedstr &&
                typeof this.page.ui.setFormNotification !== undefinedstr &&
                typeof this.page.ui.clearFormNotification !== undefinedstr) {

                return true;
            }

            return false;
        }
    }
}