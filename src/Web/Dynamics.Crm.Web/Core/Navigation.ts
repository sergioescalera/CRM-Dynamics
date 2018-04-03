module Dynamics.Crm.Forms.Navigation {

    "use strict";

    export function get(itemName: string, required: boolean = false): NavigationItem {

        // This collection does not exist with Microsoft Dynamics 365 for tablets.
        // https://msdn.microsoft.com/en-in/library/gg327828.aspx#BKMK_navigation
        if (!Xrm.Page.ui ||
            !Xrm.Page.ui.navigation ||
            !Xrm.Page.ui.navigation.items) {
            return null;
        }

        let item = Xrm.Page.ui.navigation.items.get(itemName);

        if (item) {
            return item;
        }

        let msg = "The specified navigation item could not be found: " + itemName;

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
            let value = !!visible;

            for (let i = 0; i < items.length; i++) {

                let item = get(items[i]);

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