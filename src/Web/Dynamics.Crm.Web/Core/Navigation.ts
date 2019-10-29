module Dynamics.Crm {

    "use strict";

    export class Navigation {

        protected page: FormContext;

        constructor(page: FormContext) {

            Validation.ensureNotNullOrUndefined(page, "page");

            this.page = page;
        }

        get(itemName: string, required: boolean = false): FormNavigationItem {

            // This collection does not exist with Microsoft Dynamics 365 for tablets.
            // https://msdn.microsoft.com/en-in/library/gg327828.aspx#BKMK_navigation
            if (!this.page.ui ||
                !this.page.ui.navigation ||
                !this.page.ui.navigation.items) {
                return null;
            }

            let item = this.page.ui.navigation.items.get(itemName);

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

        show(items: Array<string>): void {

            this.setVisible(items, true);
        }

        hide(items: Array<string>): void {

            this.setVisible(items, false);
        }

        setVisible(items: Array<string>, visible: boolean): void {

            if (Diagnostics.trace) {
                Diagnostics.printArguments("Navigation.setVisible", items);
            }

            if (Array.isArray(items)) {
                let value = !!visible;

                for (let i = 0; i < items.length; i++) {

                    let item = this.get(items[i]);

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
}