module Dynamics.Crm {

    "use strict";

    export class Forms {

        protected page: FormContext;

        attributes: Attributes;
        controls: Controls;
        nav: Navigation;
        notify: Notifications;
        tabs: Tabs;
        sections: Sections;
        tasks: Tasks;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
            this.attributes = new Attributes(page);
            this.controls = new Controls(page);
            this.nav = new Navigation(page);
            this.notify = new Notifications(page);
            this.tabs = new Tabs(page);
            this.sections = new Sections(page);
            this.tasks = new Tasks(page);
        }

        getClientType(): "Web" | "Outlook" | "Mobile" {

            return Xrm.Utility.getGlobalContext().client.getClient();
        }

        getEntityId(): string {

            try {

                return Core.parseIdentifier(
                    this.page.data.entity.getId());

            } catch (e) {

                throw new Error("Unable to retrieve entity id");
            }
        }

        getEntityName(): string {

            try {

                return this.page.data.entity.getEntityName();

            } catch (e) {

                throw new Error("Unable to retrieve entity name");
            }
        }

        getEntitySetName(): string {

            try {

                return Xrm.Utility.getEntitySetName(this.getEntityName());

            } catch (e) {

                throw new Error("Unable to retrieve entity set name");
            }
        }

        getFormType(): FormType {

            return this.page.ui.getFormType();
        }

        getFormFactor(): FormFactor {

            if (!Xrm.Utility.getGlobalContext().client.getFormFactor) {
                return FormFactor.Unknown;
            }

            return Xrm.Utility.getGlobalContext().client.getFormFactor();
        }

        getIsDesktop(): boolean {

            let formFactor = this.getFormFactor();

            if (formFactor !== FormFactor.Unknown) {
                return formFactor === FormFactor.Desktop;
            }

            return this.getClientType() !== ClientType.Mobile;
        }

        getIsDirty(): boolean {

            return this.page.data.entity.getIsDirty();
        }

        isCreateForm(): boolean {

            return this.getFormType() === FormType.Create;
        }

        isUpdateForm(): boolean {

            return this.getFormType() === FormType.Update;
        }

        isBulkEditForm(): boolean {

            return this.getFormType() === FormType.BulkEdit;
        }

        supportsIFrames(): boolean {

            return this.getIsDesktop();
        }

        current(): FormSelectorItem {

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

        find(label: string): FormSelectorItem {

            if (!this.page.ui ||
                !this.page.ui.formSelector ||
                !this.page.ui.formSelector.items) {
                return null;
            }

            let filter = this.page.ui.formSelector.items
                .get()
                .filter((f: FormSelectorItem) => f.getLabel() === label);

            return filter[0] || null;
        }
    }
}