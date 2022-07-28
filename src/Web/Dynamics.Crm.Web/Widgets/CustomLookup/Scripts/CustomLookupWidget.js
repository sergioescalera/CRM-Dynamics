var CustomLookupWidget;
(function (CustomLookupWidget) {
    "use strict";
    let urlTemplate = (config) => `/_controls/lookup/lookupinfo.aspx?LookupStyle=${config.style}&ShowNewButton=${(config.new ? 1 : 0)}&browse=false&dType=1&mrsh=false&objecttypes=${(config.types).join(",")}`;
    let xrm = parent["Xrm"];
    let mscrm = parent["Mscrm"];
    let searchLink;
    let config = {
        new: true,
        style: "multi",
        types: [1, 2]
    };
    function init() {
        console.log("CustomLookupWidget.init");
        searchLink = $("#search");
        searchLink.click(open);
        config = parseConfig(getParameterByName("data", window.location.search) || getParameterByName("Data", window.location.search));
    }
    CustomLookupWidget.init = init;
    function overrideConfig(config) {
        console.log("CustomLookupWidget.overrideConfig");
    }
    CustomLookupWidget.overrideConfig = overrideConfig;
    function open() {
        let options = new xrm.DialogOptions();
        options.width = 550;
        options.height = 550;
        let uri = mscrm.CrmUri.create(urlTemplate(config)).toString();
        xrm.Internal.openDialog(uri, options, null, null, openDialogCallback);
    }
    function openDialogCallback(result) {
        setAttributeValue(`${config.attribute}`, result.items.map((o) => o.id).join(", "));
        setAttributeValue(`${config.attribute}name`, result.items.map((o) => o.name).join(", "));
        setAttributeValue(`${config.attribute}type`, result.items.map((o) => o.typename).join(", "));
    }
    function setAttributeValue(attributeName, value) {
        let attribute = xrm["Page"].getAttribute(attributeName);
        if (!attribute) {
            console.warn(`Unable to find attribute ${attributeName}`);
            return;
        }
        attribute.setValue(value);
    }
    function parseConfig(configStr) {
        if (configStr) {
            let values = configStr.split(";");
            for (let i = 0; i < values.length; i++) {
                parseConfigValue(values[i]);
            }
        }
        return config;
    }
    function parseConfigValue(valueStr) {
        let pair = valueStr.split("=");
        if (pair.length !== 2) {
            return;
        }
        let key = pair[0];
        let value = pair[1];
        if (key === "new") {
            config.new = value === "true";
        }
        else if (key === "types") {
            config.types = value
                .split(",")
                .map((s) => parseInt(s.trim()));
        }
        else if (key === "style") {
            config.style = sanitizeStyle(value);
        }
        else if (key === "attribute") {
            config.attribute = value;
        }
    }
    function getParameterByName(name, url) {
        let str = name.replace(/[\[\]]/g, "\\$&");
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
    function sanitizeStyle(style) {
        return style !== "single" ? "multi" : "single";
    }
})(CustomLookupWidget || (CustomLookupWidget = {}));
