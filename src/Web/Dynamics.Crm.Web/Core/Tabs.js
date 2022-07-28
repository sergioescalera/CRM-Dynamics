var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        class Tabs {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            get(tabName, required = true) {
                let tab = this.page.ui.tabs.get(tabName);
                if (tab) {
                    return tab;
                }
                let msg = "The specified tab could not be found: " + tabName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            }
            // show / hide
            show(tabNames, condition = true) {
                if (condition) {
                    this.setVisible(tabNames, true);
                }
            }
            hide(tabNames, condition = true) {
                if (condition) {
                    this.setVisible(tabNames, false);
                }
            }
            setVisible(tabNames, value) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tabs.setVisible", tabNames, value);
                }
                if (Array.isArray(tabNames)) {
                    for (let i = 0; i < tabNames.length; i++) {
                        let tab = this.get(tabNames[i], false);
                        if (tab) {
                            tab.setVisible(value);
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Tabs.setVisible: Invalid argument. An array was expected.");
                }
            }
            // expand / collapse
            expand(tabNames, condition = true) {
                if (condition) {
                    this.expandCollapse(tabNames, true);
                }
            }
            collpase(tabNames, condition = true) {
                if (condition) {
                    this.expandCollapse(tabNames, false);
                }
            }
            expandCollapse(tabNames, value) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tabs.expandCollapse", tabNames, value);
                }
                if (Array.isArray(tabNames)) {
                    for (let i = 0; i < tabNames.length; i++) {
                        let tab = this.get(tabNames[i], false);
                        if (tab) {
                            tab.setDisplayState(value ? "expanded" : "collapsed");
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Tabs.expandCollapse: Invalid argument. An array was expected.");
                }
            }
        }
        Crm.Tabs = Tabs;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
