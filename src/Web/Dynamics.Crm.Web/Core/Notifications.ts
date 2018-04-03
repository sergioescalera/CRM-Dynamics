module Dynamics.Crm.Forms.Notifications {

    "use strict";

    let undefinedstr: string = "undefined";

    export function show(
        message: string,
        id: string,
        level: string = Dynamics.Crm.Forms.FormNotificationType.Information): void {

        Xrm.Page.ui.setFormNotification(message, level, id);
    }

    export function showHtml(
        message: string,
        id: string,
        level: string = Dynamics.Crm.Forms.FormNotificationType.Information): void {

        Xrm.Page.ui.setFormHtmlNotification(message, level, id);
    }

    export function hide(id: string, afterSeconds: number = null): void {

        if (_.isNumber(afterSeconds) && afterSeconds > 0) {
            setTimeout(() => Xrm.Page.ui.clearFormNotification(id), afterSeconds * 1000);
        } else {
            Xrm.Page.ui.clearFormNotification(id);
        }
    }

    export function htmlSupported(): boolean {

        if (typeof Xrm !== undefinedstr &&
            typeof Xrm.Page !== undefinedstr &&
            typeof Xrm.Page.ui !== undefinedstr &&
            typeof Xrm.Page.ui.setFormHtmlNotification !== undefinedstr) {

            return true;
        }

        return false;
    }

    export function supported(): boolean {

        if (typeof Xrm !== undefinedstr &&
            typeof Xrm.Page !== undefinedstr &&
            typeof Xrm.Page.ui !== undefinedstr &&
            typeof Xrm.Page.ui.setFormNotification !== undefinedstr &&
            typeof Xrm.Page.ui.clearFormNotification !== undefinedstr) {

            return true;
        }

        return false;
    }
}