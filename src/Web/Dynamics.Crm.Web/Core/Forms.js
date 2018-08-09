var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            function getClientType() {
                return Xrm.Utility.getGlobalContext().client.getClient();
            }
            Forms.getClientType = getClientType;
            function getEntityId() {
                try {
                    return Crm.Core.parseIdentifier(Xrm.Page.data.entity.getId());
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity id");
                }
            }
            Forms.getEntityId = getEntityId;
            function getEntityName() {
                try {
                    return Xrm.Page.data.entity.getEntityName();
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity name");
                }
            }
            Forms.getEntityName = getEntityName;
            function getEntitySetName() {
                try {
                    return Xrm.Page.data.entity.getEntitySetName();
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity set name");
                }
            }
            Forms.getEntitySetName = getEntitySetName;
            function getFormType() {
                return Xrm.Page.ui.getFormType();
            }
            Forms.getFormType = getFormType;
            function getFormFactor() {
                if (!Xrm.Utility.getGlobalContext().client.getFormFactor) {
                    return Forms.FormFactor.Unknown;
                }
                return Xrm.Utility.getGlobalContext().client.getFormFactor();
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
