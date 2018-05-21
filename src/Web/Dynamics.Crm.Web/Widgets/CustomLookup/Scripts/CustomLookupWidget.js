var CustomLookupWidget;
(function (CustomLookupWidget) {
    "use strict";
    var urlTemplate = function (config) { return "/_controls/lookup/lookupinfo.aspx?LookupStyle=" + config.style + "&ShowNewButton=" + (config.new ? 1 : 0) + "&browse=false&dType=1&mrsh=false&objecttypes=" + (config.types).join(","); };
    var xrm = parent.Xrm;
    var mscrm = parent.Mscrm;
    var searchLink;
    var config = {
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
        var options = new xrm.DialogOptions();
        options.width = 550;
        options.height = 550;
        var uri = mscrm.CrmUri.create(urlTemplate(config)).toString();
        xrm.Internal.openDialog(uri, options, null, null, openDialogCallback);
    }
    function openDialogCallback(result) {
        setAttributeValue("" + config.attribute, result.items.map(function (o) { return o.id; }).join(", "));
        setAttributeValue(config.attribute + "name", result.items.map(function (o) { return o.name; }).join(", "));
        setAttributeValue(config.attribute + "type", result.items.map(function (o) { return o.typename; }).join(", "));
    }
    function setAttributeValue(attributeName, value) {
        var attribute = xrm.Page.getAttribute(attributeName);
        if (!attribute) {
            console.warn("Unable to find attribute " + attributeName);
            return;
        }
        attribute.setValue(value);
    }
    function parseConfig(configStr) {
        if (configStr) {
            var values = configStr.split(";");
            for (var i = 0; i < values.length; i++) {
                parseConfigValue(values[i]);
            }
        }
        return config;
    }
    function parseConfigValue(valueStr) {
        var pair = valueStr.split("=");
        if (pair.length !== 2) {
            return;
        }
        var key = pair[0];
        var value = pair[1];
        if (key === "new") {
            config.new = value === "true";
        }
        else if (key === "types") {
            config.types = value
                .split(",")
                .map(function (s) { return parseInt(s.trim()); });
        }
        else if (key === "style") {
            config.style = sanitizeStyle(value);
        }
        else if (key === "attribute") {
            config.attribute = value;
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
    function sanitizeStyle(style) {
        return style !== "single" ? "multi" : "single";
    }
})(CustomLookupWidget || (CustomLookupWidget = {}));
