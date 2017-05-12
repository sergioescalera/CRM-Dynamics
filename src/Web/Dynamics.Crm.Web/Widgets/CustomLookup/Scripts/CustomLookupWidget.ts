module CustomLookupWidget {

    "use strict";

    var urlTemplate = (
        config: IConfig) => `/_controls/lookup/lookupinfo.aspx?LookupStyle=${config.style}&ShowNewButton=${(config.new ? 1 : 0)}&browse=false&dType=1&mrsh=false&objecttypes=${(config.types).join(",")}`;

    var xrm: Xrm = (<ICrmWindow>parent).Xrm;
    var mscrm: any = (<ICrmWindow>parent).Mscrm;
    var searchLink: JQuery;

    var config: IConfig = {
        new: true,
        style: "multi",
        types: [1, 2]
    };

    export function init(): void {

        console.log("Siboney.Crm.Widgets.LookupWidget.init");

        searchLink = $("#search");
        searchLink.click(open);

        config = parseConfig(
            getParameterByName("data", window.location.search) || getParameterByName("Data", window.location.search));
    }

    export function overrideConfig(config: IConfig): void {

        console.log("Siboney.Crm.Widgets.LookupWidget.overrideConfig");
    }

    function open(): void {

        var options: any = new xrm.DialogOptions();

        options.width = 550;
        options.height = 550;

        var uri: string = mscrm.CrmUri.create(urlTemplate(config)).toString();

        xrm.Internal.openDialog(uri, options, null, null, openDialogCallback);
    }

    function openDialogCallback(result: ILookupDialogResult): void {

        setAttributeValue(
            `${config.attribute}`,
            result.items.map((o: any) => o.id).join(", "));
        setAttributeValue(
            `${config.attribute}name`,
            result.items.map((o: any) => o.name).join(", "));
        setAttributeValue(
            `${config.attribute}type`,
            result.items.map((o: any) => o.typename).join(", "));
    }

    function setAttributeValue(attributeName: string, value: any): void {

        var attribute: Attribute = xrm.Page.getAttribute(attributeName);

        if (!attribute) {
            console.warn(`Unable to find attribute ${attributeName}`);
            return;
        }

        attribute.setValue(value);
    }

    function parseConfig(configStr?: string): IConfig {
        
        if (configStr) {
            var values: string[] = configStr.split(";");
            for (var i: number = 0; i < values.length; i++) {
                parseConfigValue(values[i]);
            }
        }

        return config;
    }

    function parseConfigValue(valueStr: string): void {

        var pair: string[] = valueStr.split("=");
        if (pair.length !== 2) {
            return;
        }

        var key: string = pair[0];
        var value: string = pair[1];

        if (key === "new") {
            config.new = value === "true";
        } else if (key === "types") {
            config.types = value
                .split(",")
                .map((s: string) => parseInt(s.trim()));
        } else if (key === "style") {
            config.style = sanitizeStyle(value);
        } else if (key === "attribute") {
            config.attribute = value;
        }
    }

    function getParameterByName(name: string, url: string): string {
        var str: string = name.replace(/[\[\]]/g, "\\$&");
        var regex: RegExp = new RegExp("[?&]" + str + "(=([^&#]*)|&|#|$)");
        var results: RegExpExecArray = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function sanitizeStyle(style: string): style {

        return style !== "single" ? "multi" : "single";
    }

    declare type style = "multi" | "single";

    interface IConfig {
        attribute?: string;
        types: number[];
        style: style;
        new: boolean;
    }

    interface ILookupDialogResult {
        items: LookupControlItem[];
    }
}