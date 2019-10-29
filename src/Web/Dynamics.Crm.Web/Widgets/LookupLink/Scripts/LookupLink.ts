module LookupLink {

    "use strict";

    let xrm: Xrm;
    let link: HTMLAnchorElement;
    let message: HTMLElement;
    let attributeName: string;
    let attribute: Attribute;

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

        link = <HTMLAnchorElement>document.getElementById("lookup-link");
        message = document.getElementById("message");

        attributeName = getParameterByName("data", window.location.search) ||
            getParameterByName("Data", window.location.search);

        if (!attributeName) {
            throw new Error("Pass attribute name as custom data parameter");
        }

        attribute = xrm["Page"].getAttribute(attributeName);

        if (!attribute) {
            throw new Error(`Invalid attribute name ${attributeName}`);
        }

        link.addEventListener("click", openEntity);
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

        if (!lookup || !lookup.length) {
            link.style.display = "none";
        } else {
            link.style.display = "inline-block";
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
}