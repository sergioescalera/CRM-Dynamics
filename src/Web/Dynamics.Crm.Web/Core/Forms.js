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
            function current() {
                // The formSelectoritems collection does not exist and the formSelector.getCurrentItem method isn't supported for Dynamics 365 mobile clients (phones and tablets) and the interactive service hub.
                // https://msdn.microsoft.com/en-in/library/gg327828.aspx#formSelector
                if (!Xrm.Page.ui ||
                    !Xrm.Page.ui.formSelector ||
                    !Xrm.Page.ui.formSelector.items) {
                    return null;
                }
                // When only one form is available this method will return null.
                return Xrm.Page.ui.formSelector.getCurrentItem()
                    || Xrm.Page.ui.formSelector.items.get(0)
                    || null;
            }
            Forms.current = current;
            function find(label) {
                if (!Xrm.Page.ui ||
                    !Xrm.Page.ui.formSelector ||
                    !Xrm.Page.ui.formSelector.items) {
                    return null;
                }
                var filter = Xrm.Page.ui.formSelector.items
                    .get()
                    .filter(function (f) { return f.getLabel() === label; });
                return filter[0] || null;
            }
            Forms.find = find;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
