module LookupLink {

    "use strict";

    let xrm: Xrm;
    let link: HTMLAnchorElement;
    let createlink: HTMLAnchorElement;
    let message: HTMLElement;
    let attributeName: string;
    let attribute: Attribute;
    let descriptor: AttributeDescriptor;

    export function init(): void {

        console.log("LookupLink.init()");

        try {
            initInternal();
        } catch (e) {
            message.innerText = e.message;
            message.style.display = "inline-block";
        }
    }

    function initInternal(): void {

        xrm = getXrmObject();

        if (!xrm) {
            throw new Error("Unable to resolve CRM form dependencies");
        }

        link = document.querySelector<HTMLAnchorElement>("#lookup-link");
        createlink = document.querySelector<HTMLAnchorElement>("#create-link");

        message = document.querySelector<HTMLElement>("#message");

        attributeName = getParameterByName("data", window.location.search) ||
            getParameterByName("Data", window.location.search);

        if (!attributeName) {
            throw new Error("Pass attribute name as custom data parameter");
        }

        attribute = xrm["Page"].getAttribute(attributeName);

        if (!attribute) {
            throw new Error(`Invalid attribute name ${attributeName}`);
        }

        try {
            if ("getAttrDescriptor" in attribute) {
                descriptor = attribute.getAttrDescriptor();
                createlink.innerText = "New " + descriptor.DisplayName;
            }
        } catch (e) {
            console.warn("LookupLink.init", e);
        }

        link.addEventListener("click", openEntity);

        createlink.addEventListener("click", openCreate);
        
        attribute.addOnChange(setLinkVisibility);

        setLinkVisibility();
    }

    function getXrmObject(): Xrm {

        let parent = window.parent;

        if (isCrmFormsFrame(parent)) {
            return parent["Xrm"];
        } else {
            for (let i = 0; i < parent.frames.length; i++) {
                let child = parent.frames[i];
                if (isCrmFormsFrame(child)) {
                    return child["Xrm"];
                }
            }
        }
    }

    function isCrmFormsFrame(win: any): boolean {

        try {
            if (win === window) {
                return false;
            }
            return win
                && typeof win.Xrm !== "undefined"
                && typeof win.Xrm.Page !== "undefined"
                && typeof win.Xrm.Page.getAttribute !== "undefined";
        } catch (e) {
            console.warn(e);
            return false;
        }
    }

    function getParameterByName(name: string, url: string): string {

        let str: string = name.replace(/[\[\]]/g, "\\$&");

        let regex = new RegExp("[?&]" + str + "(=([^&#]*)|&|#|$)");

        let results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return "";
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function setLinkVisibility(): void {

        let lookup = <LookupControlItem[]>attribute.getValue();

        if (lookup && lookup.length) {
            link.style.display = "inline-block";
            createlink.style.display = "none";
        } else {
            link.style.display = "none";
            createlink.style.display = !descriptor ? "none" : "inline-block";
        }
    }

    function openEntity(): void {

        let lookup = <LookupControlItem[]>attribute.getValue();

        if (!lookup || !lookup.length) {
            return;
        }

        xrm.Navigation.openForm({
            entityName: lookup[0].entityType,
            entityId: lookup[0].id,
            openInNewWindow: true
        });
    }

    function openCreate(): void {

        if (!descriptor ||
            !descriptor.Targets[0]) {
            return;
        }

        xrm.Navigation.openForm({
            entityName: descriptor.Targets[0],
            openInNewWindow: true,
            useQuickCreateForm: true
        }).then(
            (data) => {

                if (data && data.savedEntityReference) {

                    attribute.setValue(data.savedEntityReference);
                    attribute.fireOnChange();
                }
            },
            (error) => {

                console.warn("LookupLink.openCreate", error);
            });
    }
}