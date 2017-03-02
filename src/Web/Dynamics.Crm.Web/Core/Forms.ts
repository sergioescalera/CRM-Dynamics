module Dynamics.Crm.Forms {

    "use strict";

    export function getClientType(): string {

        return Xrm.Page.context.client.getClient();
    }

    export function getFormType(): FormType {

        return Xrm.Page.ui.getFormType();
    }

    export function getFormFactor(): FormFactor {

        if (!Xrm.Page.context.client.getFormFactor) {
            return FormFactor.Unknown;
        }

        return Xrm.Page.context.client.getFormFactor();
    }

    export function getIsDesktop(): boolean {

        var formFactor = getFormFactor();

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

    export function supportsIFrames(): boolean {

        return getIsDesktop();
    }    
}