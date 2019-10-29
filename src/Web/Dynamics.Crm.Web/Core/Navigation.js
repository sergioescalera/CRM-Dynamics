var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var Navigation = /** @class */ (function () {
            function Navigation(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            Navigation.prototype.get = function (itemName, required) {
                if (required === void 0) { required = false; }
                // This collection does not exist with Microsoft Dynamics 365 for tablets.
                // https://msdn.microsoft.com/en-in/library/gg327828.aspx#BKMK_navigation
                if (!this.page.ui ||
                    !this.page.ui.navigation ||
                    !this.page.ui.navigation.items) {
                    return null;
                }
                var item = this.page.ui.navigation.items.get(itemName);
                if (item) {
                    return item;
                }
                var msg = "The specified navigation item could not be found: " + itemName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            };
            Navigation.prototype.show = function (items) {
                this.setVisible(items, true);
            };
            Navigation.prototype.hide = function (items) {
                this.setVisible(items, false);
            };
            Navigation.prototype.setVisible = function (items, visible) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Navigation.setVisible", items);
                }
                if (Array.isArray(items)) {
                    var value = !!visible;
                    for (var i = 0; i < items.length; i++) {
                        var item = this.get(items[i]);
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
            };
            return Navigation;
        }());
        Crm.Navigation = Navigation;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
