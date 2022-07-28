var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        class Forms {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.attributes = new Crm.Attributes(page);
                this.controls = new Crm.Controls(page);
                this.nav = new Crm.Navigation(page);
                this.notify = new Crm.Notifications(page);
                this.tabs = new Crm.Tabs(page);
                this.sections = new Crm.Sections(page);
                this.tasks = new Crm.Tasks(page);
            }
            getClientType() {
                return Xrm.Utility.getGlobalContext().client.getClient();
            }
            getEntityId() {
                try {
                    return Crm.Core.parseIdentifier(this.page.data.entity.getId());
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity id");
                }
            }
            getEntityName() {
                try {
                    return this.page.data.entity.getEntityName();
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity name");
                }
            }
            getEntitySetName() {
                try {
                    return Xrm.Utility.getEntitySetName(this.getEntityName());
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity set name");
                }
            }
            getFormType() {
                return this.page.ui.getFormType();
            }
            getFormFactor() {
                if (!Xrm.Utility.getGlobalContext().client.getFormFactor) {
                    return Crm.FormFactor.Unknown;
                }
                return Xrm.Utility.getGlobalContext().client.getFormFactor();
            }
            getIsDesktop() {
                let formFactor = this.getFormFactor();
                if (formFactor !== Crm.FormFactor.Unknown) {
                    return formFactor === Crm.FormFactor.Desktop;
                }
                return this.getClientType() !== Crm.ClientType.Mobile;
            }
            getIsDirty() {
                return this.page.data.entity.getIsDirty();
            }
            isCreateForm() {
                return this.getFormType() === Crm.FormType.Create;
            }
            isUpdateForm() {
                return this.getFormType() === Crm.FormType.Update;
            }
            isBulkEditForm() {
                return this.getFormType() === Crm.FormType.BulkEdit;
            }
            supportsIFrames() {
                return this.getIsDesktop();
            }
            current() {
                // The formSelectoritems collection does not exist and the formSelector.getCurrentItem method isn't supported for Dynamics 365 mobile clients (phones and tablets) and the interactive service hub.
                // https://msdn.microsoft.com/en-in/library/gg327828.aspx#formSelector
                if (!this.page.ui ||
                    !this.page.ui.formSelector ||
                    !this.page.ui.formSelector.items) {
                    return null;
                }
                // When only one form is available this method will return null.
                return this.page.ui.formSelector.getCurrentItem()
                    || this.page.ui.formSelector.items.get(0)
                    || null;
            }
            find(label) {
                if (!this.page.ui ||
                    !this.page.ui.formSelector ||
                    !this.page.ui.formSelector.items) {
                    return null;
                }
                let filter = this.page.ui.formSelector.items
                    .get()
                    .filter((f) => f.getLabel() === label);
                return filter[0] || null;
            }
        }
        Crm.Forms = Forms;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
