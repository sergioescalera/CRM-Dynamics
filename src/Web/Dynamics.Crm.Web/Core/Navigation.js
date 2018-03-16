var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Navigation;
            (function (Navigation) {
                "use strict";
                function get(itemName, required) {
                    if (required === void 0) { required = false; }
                    // This collection does not exist with Microsoft Dynamics 365 for tablets.
                    // https://msdn.microsoft.com/en-in/library/gg327828.aspx#BKMK_navigation
                    if (!Xrm.Page.ui ||
                        !Xrm.Page.ui.navigation ||
                        !Xrm.Page.ui.navigation.items) {
                        return null;
                    }
                    var item = Xrm.Page.ui.navigation.items.get(itemName);
                    if (item) {
                        return item;
                    }
                    var msg = "The specified navigation item could not be found: " + itemName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Navigation.get = get;
                function show(items) {
                    setVisible(items, true);
                }
                Navigation.show = show;
                function hide(items) {
                    setVisible(items, false);
                }
                Navigation.hide = hide;
                function setVisible(items, visible) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Navigation.setVisible", items);
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
                    }
                    else {
                        Crm.Diagnostics.log.Warning("Navigation.setVisible: Invalid argument. An array was expected.");
                    }
                }
                Navigation.setVisible = setVisible;
            })(Navigation = Forms.Navigation || (Forms.Navigation = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
