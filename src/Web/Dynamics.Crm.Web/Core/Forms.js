var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var Forms = /** @class */ (function () {
            function Forms(page) {
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
            Forms.prototype.getClientType = function () {
                return Xrm.Utility.getGlobalContext().client.getClient();
            };
            Forms.prototype.getEntityId = function () {
                try {
                    return Crm.Core.parseIdentifier(this.page.data.entity.getId());
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity id");
                }
            };
            Forms.prototype.getEntityName = function () {
                try {
                    return this.page.data.entity.getEntityName();
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity name");
                }
            };
            Forms.prototype.getEntitySetName = function () {
                try {
                    return Xrm.Utility.getEntitySetName(this.getEntityName());
                }
                catch (e) {
                    throw new Error("Unable to retrieve entity set name");
                }
            };
            Forms.prototype.getFormType = function () {
                return this.page.ui.getFormType();
            };
            Forms.prototype.getFormFactor = function () {
                if (!Xrm.Utility.getGlobalContext().client.getFormFactor) {
                    return Crm.FormFactor.Unknown;
                }
                return Xrm.Utility.getGlobalContext().client.getFormFactor();
            };
            Forms.prototype.getIsDesktop = function () {
                var formFactor = this.getFormFactor();
                if (formFactor !== Crm.FormFactor.Unknown) {
                    return formFactor === Crm.FormFactor.Desktop;
                }
                return this.getClientType() !== Crm.ClientType.Mobile;
            };
            Forms.prototype.getIsDirty = function () {
                return this.page.data.entity.getIsDirty();
            };
            Forms.prototype.isCreateForm = function () {
                return this.getFormType() === Crm.FormType.Create;
            };
            Forms.prototype.isUpdateForm = function () {
                return this.getFormType() === Crm.FormType.Update;
            };
            Forms.prototype.isBulkEditForm = function () {
                return this.getFormType() === Crm.FormType.BulkEdit;
            };
            Forms.prototype.supportsIFrames = function () {
                return this.getIsDesktop();
            };
            Forms.prototype.current = function () {
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
            };
            Forms.prototype.find = function (label) {
                if (!this.page.ui ||
                    !this.page.ui.formSelector ||
                    !this.page.ui.formSelector.items) {
                    return null;
                }
                var filter = this.page.ui.formSelector.items
                    .get()
                    .filter(function (f) { return f.getLabel() === label; });
                return filter[0] || null;
            };
            return Forms;
        }());
        Crm.Forms = Forms;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
