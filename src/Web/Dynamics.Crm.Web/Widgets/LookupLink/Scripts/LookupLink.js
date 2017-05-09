var LookupLink;
(function (LookupLink) {
    var xrm;
    var link;
    var message;
    var attributeName;
    var attribute;
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
        link = document.getElementById("lookup-link");
        message = document.getElementById("message");
        attributeName = getParameterByName("data", window.location.search) ||
            getParameterByName("Data", window.location.search);
        if (!attributeName) {
            throw new Error("Pass attribute name as custom data parameter");
        }
        attribute = xrm.Page.getAttribute(attributeName);
        if (!attribute) {
            throw new Error("Invalid attribute name " + attributeName);
        }
        link.addEventListener("click", openEntity);
        attribute.addOnChange(setLinkVisibility);
        setLinkVisibility();
    }
    function getXrmObject() {
        var parent = window.parent;
        if (isCrmFormsFrame(parent)) {
            return parent.Xrm;
        }
        else {
            for (var i = 0; i < parent.frames.length; i++) {
                var child = parent.frames[i];
                if (isCrmFormsFrame(child)) {
                    return child.Xrm;
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
        if (!lookup || !lookup.length) {
            link.style.display = "none";
        }
        else {
            link.style.display = "inline-block";
        }
    }
    function openEntity() {
        var lookup = attribute.getValue();
        if (!lookup || !lookup.length) {
            return;
        }
        xrm.Utility.openEntityForm(lookup[0].entityType, lookup[0].id, null, {
            openInNewWindow: true
        });
    }
})(LookupLink || (LookupLink = {}));
