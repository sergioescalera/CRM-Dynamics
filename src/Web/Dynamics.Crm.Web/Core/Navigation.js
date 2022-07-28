var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        class Navigation {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            get(itemName, required = false) {
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
                Crm.Diagnostics.log.Message(msg);
                return null;
            }
            show(items) {
                this.setVisible(items, true);
            }
            hide(items) {
                this.setVisible(items, false);
            }
            setVisible(items, visible) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Navigation.setVisible", items);
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
                }
                else {
                    Crm.Diagnostics.log.Warning("Navigation.setVisible: Invalid argument. An array was expected.");
                }
            }
        }
        Crm.Navigation = Navigation;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
