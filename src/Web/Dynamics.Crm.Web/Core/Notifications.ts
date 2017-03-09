module Dynamics.Crm.Forms.Notifications {

    "use strict";

    export function show(
        message: string,
        id: string,
        level: string = Dynamics.Crm.Forms.FormNotificationType.Information): void {

        Xrm.Page.ui.setFormNotification(message, level, id);
    }

    export function hide(id: string, afterSeconds: number = null): void {

        if (_.isNumber(afterSeconds) && afterSeconds > 0) {
            setTimeout(() => Xrm.Page.ui.clearFormNotification(id), afterSeconds * 1000);
        } else {
            Xrm.Page.ui.clearFormNotification(id);
        }
    }
}