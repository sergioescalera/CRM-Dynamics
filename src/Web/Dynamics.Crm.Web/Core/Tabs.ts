module Dynamics.Crm.Forms.Tabs {

    "use strict";

    export function get(tabName: string, required: boolean = true): Tab {

        var tab = Xrm.Page.ui.tabs.get(tabName);

        if (tab) {
            return tab;
        }

        var msg = "The specified tab could not be found: " + tabName;

        if (required) {
            throw new Error(msg);
        }

        Diagnostics.log.Message(msg);

        return null;
    }

    // show / hide

    export function show(tabNames: string[], condition: boolean = true): void {

        if (condition) {
            setVisible(tabNames, true);
        }
    }

    export function hide(tabNames: string[], condition: boolean = true): void {

        if (condition) {
            setVisible(tabNames, false);
        }
    }

    export function setVisible(tabNames: string[], value: boolean): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("Tabs.setVisible", tabNames, value);
        }

        if (Array.isArray(tabNames)) {

            for (var i = 0; i < tabNames.length; i++) {

                var tab = get(tabNames[i], false);

                if (tab) {
                    tab.setVisible(value);
                }
            }

        } else {

            Diagnostics.log.Warning("Tabs.setVisible: Invalid argument. An array was expected.");
        }
    }

    // expand / collapse

    export function expand(tabNames: string[], condition: boolean = true): void {

        if (condition) {
            expandCollapse(tabNames, true);
        }
    }

    export function collpase(tabNames: string[], condition: boolean = true): void {

        if (condition) {
            expandCollapse(tabNames, false);
        }
    }

    export function expandCollapse(tabNames: string[], value: boolean): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("Tabs.expandCollapse", tabNames, value);
        }

        if (Array.isArray(tabNames)) {

            for (var i = 0; i < tabNames.length; i++) {

                var tab = get(tabNames[i], false);

                if (tab) {
                    tab.setDisplayState(value ? "expanded" : "collapsed");
                }
            }

        } else {

            Diagnostics.log.Warning("Tabs.expandCollapse: Invalid argument. An array was expected.");
        }
    }
}