var LookupLink;
(function (LookupLink) {
    "use strict";
    var xrm;
    var link;
    var createEnabled = false;
    var createlink;
    var message;
    var attributeName;
    var attribute;
    var descriptor;
    var isUci = false;
    function init() {
        console.log("LookupLink.init()");
        try {
            initInternal();
        }
        catch (e) {
            message.innerText = e.message;
            message.style.display = "inline-block";
        }
    }
    LookupLink.init = init;
    function initInternal() {
        xrm = getXrmObject();
        if (!xrm) {
            throw new Error("Unable to resolve CRM form dependencies");
        }
        isUci = resolveIsUci(xrm);
        link = document.querySelector("#lookup-link");
        createlink = document.querySelector("#create-link");
        message = document.querySelector("#message");
        var data = (getParameterByName("data", window.location.search) ||
            getParameterByName("Data", window.location.search) || "").split("|");
        if (!data || !data[0]) {
            throw new Error("Please pass 'attribute name' as custom data parameter");
        }
        attributeName = data[0];
        createEnabled = data[1] === "quickCreate";
        attribute = xrm["Page"].getAttribute(attributeName);
        if (!attribute) {
            throw new Error("Invalid attribute name " + attributeName);
        }
        try {
            if ("getAttrDescriptor" in attribute) {
                descriptor = attribute.getAttrDescriptor();
                createlink.innerText = "New " + descriptor.DisplayName;
            }
        }
        catch (e) {
            console.warn("LookupLink.init", e);
        }
        link.addEventListener("click", openEntity);
        createlink.addEventListener("click", openCreate);
        attribute.addOnChange(setLinkVisibility);
        window.addEventListener("unload", onUnload);
        setLinkVisibility();
    }
    function getXrmObject() {
        var parent = window.parent;
        if (isCrmFormsFrame(parent)) {
            return parent["Xrm"];
        }
        else {
            for (var i = parent.frames.length - 1; i >= 0; i--) {
                var child = parent.frames[i];
                if (isCrmFormsFrame(child)) {
                    return child["Xrm"];
                }
            }
        }
    }
    function isCrmFormsFrame(win) {
        try {
            if (win === window) {
                return false;
            }
            return win
                && typeof win.Xrm !== "undefined"
                && typeof win.Xrm.Page !== "undefined"
                && typeof win.Xrm.Page.getAttribute !== "undefined";
        }
        catch (e) {
            console.warn(e);
            return false;
        }
    }
    function resolveIsUci(xrm) {
        try {
            if (typeof xrm !== "undefined" &&
                typeof xrm.Internal !== "undefined" && "isUci" in xrm.Internal) {
                return xrm.Internal.isUci();
            }
            var context = xrm.Utility.getGlobalContext();
            var appUrl = context.getCurrentAppUrl();
            var clientUrl = context.getClientUrl();
            return appUrl !== clientUrl;
        }
        catch (e) {
            console.warn("LookupLink.isUci", e);
            return false;
        }
    }
    function getParameterByName(name, url) {
        var str = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + str + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    function setLinkVisibility() {
        var lookup = attribute.getValue();
        if (lookup && lookup.length) {
            link.style.display = "inline-block";
            createlink.style.display = "none";
        }
        else {
            link.style.display = "none";
            createlink.style.display = !descriptor || !createEnabled || !isUci ? "none" : "inline-block";
        }
    }
    function openEntity() {
        var lookup = attribute.getValue();
        if (!lookup || !lookup.length) {
            return;
        }
        xrm.Navigation.openForm({
            entityName: lookup[0].entityType,
            entityId: lookup[0].id,
            openInNewWindow: true
        });
    }
    function openCreate() {
        if (!descriptor ||
            !descriptor.Targets[0]) {
            return;
        }
        xrm.Navigation.openForm({
            entityName: descriptor.Targets[0],
            openInNewWindow: true,
            useQuickCreateForm: true
        }).then(function (data) {
            if (data && data.savedEntityReference) {
                attribute.setValue(data.savedEntityReference);
                attribute.fireOnChange();
            }
        }, function (error) {
            console.warn("LookupLink.openCreate", error);
        });
    }
    function onUnload() {
        console.log("LookupLink.onUnload()");
        try {
            attribute.removeOnChange(setLinkVisibility);
        }
        catch (e) {
            console.warn("LookupLink.onUnload()", e);
        }
    }
})(LookupLink || (LookupLink = {}));
