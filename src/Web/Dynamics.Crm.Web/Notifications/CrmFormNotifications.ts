module Notifications {

    "use strict";
    
    export class CrmFormNotificationService implements INotificationService {

        hide(id: string): void {

            Xrm.Page.ui.clearFormNotification(id);
        }

        init(): void {

            if (!this.test()) {
                throw new Error("Not supported.");
            }
        }

        show(options: Options): void {
            
            if (_.isFunction(Xrm.Page.ui.setFormHtmlNotification)) {
                Xrm.Page.ui.setFormHtmlNotification(options.message, options.type, options.id);
            } else {
                Xrm.Page.ui.setFormNotification(options.message, options.type, options.id);
            }
        }

        test(): boolean {

            return !_.isUndefined(Xrm) && !_.isNull(Xrm)
                && !_.isUndefined(Xrm.Page) && !_.isNull(Xrm.Page)
                && !_.isUndefined(Xrm.Page.ui) && !_.isNull(Xrm.Page.ui)
                && _.isFunction(Xrm.Page.ui.setFormNotification);
        }
    }
}