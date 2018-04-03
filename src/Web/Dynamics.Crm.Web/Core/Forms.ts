module Dynamics.Crm.Forms {

    "use strict";

    export function getClientType(): "Web" | "Outlook" | "Mobile" {

        return Xrm.Utility.getGlobalContext().client.getClient();
    }

    export function getFormType(): FormType {

        return Xrm.Page.ui.getFormType();
    }

    export function getFormFactor(): FormFactor {

        if (!Xrm.Utility.getGlobalContext().client.getFormFactor) {
            return FormFactor.Unknown;
        }

        return Xrm.Utility.getGlobalContext().client.getFormFactor();
    }

    export function getIsDesktop(): boolean {

        let formFactor = getFormFactor();

        if (formFactor !== FormFactor.Unknown) {
            return formFactor === FormFactor.Desktop;
        }

        return getClientType() !== ClientType.Mobile;
    }

    export function getIsDirty(): boolean {

        return Xrm.Page.data.entity.getIsDirty();
    }

    export function isCreateForm(): boolean {

        return getFormType() === FormType.Create;
    }

    export function isUpdateForm(): boolean {

        return getFormType() === FormType.Update;
    }

    export function isBulkEditForm(): boolean {

        return getFormType() === FormType.BulkEdit;
    }

    export function supportsIFrames(): boolean {

        return getIsDesktop();
    }

    export function current(): FormSelectorItem {

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

    export function find(label: string): FormSelectorItem {

        if (!Xrm.Page.ui ||
            !Xrm.Page.ui.formSelector ||
            !Xrm.Page.ui.formSelector.items) {
            return null;
        }

        let filter = Xrm.Page.ui.formSelector.items
            .get()
            .filter((f: FormSelectorItem) => f.getLabel() === label);

        return filter[0] || null;
    }
}