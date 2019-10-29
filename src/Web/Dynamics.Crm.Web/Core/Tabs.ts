module Dynamics.Crm {

    "use strict";

    export class Tabs {

        protected page: FormContext;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
        }
        
        get(tabName: string, required: boolean = true): Tab {

            let tab = this.page.ui.tabs.get(tabName);

            if (tab) {
                return tab;
            }

            let msg = "The specified tab could not be found: " + tabName;

            if (required) {
                throw new Error(msg);
            }

            Diagnostics.log.Message(msg);

            return null;
        }

        // show / hide

        show(tabNames: string[], condition: boolean = true): void {

            if (condition) {
                this.setVisible(tabNames, true);
            }
        }

        hide(tabNames: string[], condition: boolean = true): void {

            if (condition) {
                this.setVisible(tabNames, false);
            }
        }

        setVisible(tabNames: string[], value: boolean): void {

            if (Diagnostics.trace) {
                Diagnostics.printArguments("Tabs.setVisible", tabNames, value);
            }

            if (Array.isArray(tabNames)) {

                for (let i = 0; i < tabNames.length; i++) {

                    let tab = this.get(tabNames[i], false);

                    if (tab) {
                        tab.setVisible(value);
                    }
                }

            } else {

                Diagnostics.log.Warning("Tabs.setVisible: Invalid argument. An array was expected.");
            }
        }

        // expand / collapse

        expand(tabNames: string[], condition: boolean = true): void {

            if (condition) {
                this.expandCollapse(tabNames, true);
            }
        }

        collpase(tabNames: string[], condition: boolean = true): void {

            if (condition) {
                this.expandCollapse(tabNames, false);
            }
        }

        expandCollapse(tabNames: string[], value: boolean): void {

            if (Diagnostics.trace) {
                Diagnostics.printArguments("Tabs.expandCollapse", tabNames, value);
            }

            if (Array.isArray(tabNames)) {

                for (let i = 0; i < tabNames.length; i++) {

                    let tab = this.get(tabNames[i], false);

                    if (tab) {
                        tab.setDisplayState(value ? "expanded" : "collapsed");
                    }
                }

            } else {

                Diagnostics.log.Warning("Tabs.expandCollapse: Invalid argument. An array was expected.");
            }
        }
    }
}