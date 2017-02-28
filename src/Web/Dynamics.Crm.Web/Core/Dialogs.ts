module Dynamics.Crm.Dialogs {

    "use strict";

    export function open(
        dialogId: string,
        entityName?: string,
        entityId?: string,
        width: number = 800,
        height: number = 600,
        modal: string = "yes") {

        var url = getUrl(dialogId, entityName, entityId);

        var features = "center=yes,width={w},height={h},modal={m}"
            .replace("{m}", modal)
            .replace("{h}", height.toString())
            .replace("{w}", width.toString());

        window.open(url, dialogId, features, false);
    }

    export function getUrl(
        dialogId: string,
        entityName: string = Xrm.Page.data.entity.getEntityName(),
        entityId: string = Xrm.Page.data.entity.getId()) {

        var url = Xrm.Page.context.getClientUrl() +
            "/cs/dialog/rundialog.aspx?DialogId={dialogId}&EntityName={type}&ObjectId={id}"
            .replace("{type}", entityName)
            .replace("{id}", entityId);

        return url;
    }
}