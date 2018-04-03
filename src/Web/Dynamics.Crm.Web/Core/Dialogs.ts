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

        let features = "center=yes,width={w},height={h},modal={m}"
            .replace("{m}", modal)
            .replace("{h}", height.toString())
            .replace("{w}", width.toString());

        window.open(url, dialogId, features, false);
    }

    export function getUrl(
        dialogId: string,
        entityName: string = Xrm.Page.data.entity.getEntityName(),
        entityId: string = Xrm.Page.data.entity.getId()): string {

        let url = Xrm.Utility.getGlobalContext().getClientUrl() +
            "/cs/dialog/rundialog.aspx?DialogId={dialogId}&EntityName={type}&ObjectId={id}"
            .replace("{type}", entityName)
            .replace("{id}", entityId);

        return url;
    }
}