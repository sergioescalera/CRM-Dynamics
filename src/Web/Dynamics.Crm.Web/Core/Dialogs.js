var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Dialogs;
        (function (Dialogs) {
            "use strict";
            function open(dialogId, entityName, entityId, width, height, modal) {
                if (width === void 0) { width = 800; }
                if (height === void 0) { height = 600; }
                if (modal === void 0) { modal = "yes"; }
                var url = getUrl(dialogId, entityName, entityId);
                var features = "center=yes,width={w},height={h},modal={m}"
                    .replace("{m}", modal)
                    .replace("{h}", height.toString())
                    .replace("{w}", width.toString());
                window.open(url, dialogId, features, false);
            }
            Dialogs.open = open;
            function getUrl(dialogId, entityName, entityId) {
                if (entityName === void 0) { entityName = Xrm.Page.data.entity.getEntityName(); }
                if (entityId === void 0) { entityId = Xrm.Page.data.entity.getId(); }
                var url = Xrm.Page.context.getClientUrl() +
                    "/cs/dialog/rundialog.aspx?DialogId={dialogId}&EntityName={type}&ObjectId={id}"
                        .replace("{type}", entityName)
                        .replace("{id}", entityId);
                return url;
            }
            Dialogs.getUrl = getUrl;
        })(Dialogs = Crm.Dialogs || (Crm.Dialogs = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
