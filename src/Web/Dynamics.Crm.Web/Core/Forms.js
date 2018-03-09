var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            function getClientType() {
                return Xrm.Page.context.client.getClient();
            }
            Forms.getClientType = getClientType;
            function getFormType() {
                return Xrm.Page.ui.getFormType();
            }
            Forms.getFormType = getFormType;
            function getFormFactor() {
                if (!Xrm.Page.context.client.getFormFactor) {
                    return Forms.FormFactor.Unknown;
                }
                return Xrm.Page.context.client.getFormFactor();
            }
            Forms.getFormFactor = getFormFactor;
            function getIsDesktop() {
                var formFactor = getFormFactor();
                if (formFactor !== Forms.FormFactor.Unknown) {
                    return formFactor === Forms.FormFactor.Desktop;
                }
                return getClientType() !== Forms.ClientType.Mobile;
            }
            Forms.getIsDesktop = getIsDesktop;
            function getIsDirty() {
                return Xrm.Page.data.entity.getIsDirty();
            }
            Forms.getIsDirty = getIsDirty;
            function isCreateForm() {
                return getFormType() === Forms.FormType.Create;
            }
            Forms.isCreateForm = isCreateForm;
            function isUpdateForm() {
                return getFormType() === Forms.FormType.Update;
            }
            Forms.isUpdateForm = isUpdateForm;
            function isBulkEditForm() {
                return getFormType() === Forms.FormType.BulkEdit;
            }
            Forms.isBulkEditForm = isBulkEditForm;
            function supportsIFrames() {
                return getIsDesktop();
            }
            Forms.supportsIFrames = supportsIFrames;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
