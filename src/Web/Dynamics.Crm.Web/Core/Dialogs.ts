module Dynamics.Crm.Dialogs {

    "use strict";

    export function open(
        dialogId: string,
        entityName?: string,
        entityId?: string,
        width: number = 800,
        height: number = 600,
        modal: string = "yes"): void {

        let url = getUrl(dialogId, entityName, entityId);

        let features = `center=yes,width=${width},height=${height},modal=${modal}`;

        window.open(url, dialogId, features, false);
    }

    export function getUrl(
        dialogId: string,
        entityName: string = Forms.getEntityName(),
        entityId: string = Forms.getEntityId()): string {

        let baseUrl = Xrm.Utility.getGlobalContext().getClientUrl();
        let url = `${baseUrl}/cs/dialog/rundialog.aspx?DialogId=${dialogId}&EntityName=${entityName}&ObjectId=${entityId}`;

        return url;
    }
}