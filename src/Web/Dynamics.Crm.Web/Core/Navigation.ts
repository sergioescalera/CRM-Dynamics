module Dynamics.Crm.Forms.Navigation {

    "use strict";

    export function get(itemName: string, required: boolean = false): NavigationItem {

        var item = Xrm.Page.ui.navigation.items.get(itemName);

        if (item) {
            return item;
        }

        var msg = "The specified navigation item could not be found: " + itemName;

        if (required) {
            throw new Error(msg);
        }

        Diagnostics.log.Message(msg);

        return null;
    }

    export function show(items: Array<string>): void {

        setVisible(items, true);
    }

    export function hide(items: Array<string>): void {

        setVisible(items, false);
    }

    export function setVisible(items: Array<string>, visible: boolean): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("Navigation.setVisible", items);
        }

        if (Array.isArray(items)) {
            var value = !!visible;

            for (var i = 0; i < items.length; i++) {

                var item = get(items[i]);

                if (!item) {
                    continue;
                }

                if (item.getVisible() !== value) {
                    item.setVisible(value);
                }
            }

        } else {

            Diagnostics.log.Warning("Navigation.setVisible: Invalid argument. An array was expected.");
        }
    }
}