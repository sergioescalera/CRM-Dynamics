var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Tabs;
            (function (Tabs) {
                "use strict";
                function get(tabName, required) {
                    if (required === void 0) { required = true; }
                    var tab = Xrm.Page.ui.tabs.get(tabName);
                    if (tab) {
                        return tab;
                    }
                    var msg = "The specified tab could not be found: " + tabName;
                    if (required) {
                        throw new Error(msg);
                    }
                    Crm.Diagnostics.log.Message(msg);
                    return null;
                }
                Tabs.get = get;
                // show / hide
                function show(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(tabNames, true);
                    }
                }
                Tabs.show = show;
                function hide(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(tabNames, false);
                    }
                }
                Tabs.hide = hide;
                function setVisible(tabNames, value) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Tabs.setVisible", tabNames, value);
                    }
                    if (Array.isArray(tabNames)) {
                        for (var i = 0; i < tabNames.length; i++) {
                            var tab = get(tabNames[i], false);
                            if (tab) {
                                tab.setVisible(value);
                            }
                        }
                    }
                    else {
                        Crm.Diagnostics.log.Warning("Tabs.setVisible: Invalid argument. An array was expected.");
                    }
                }
                Tabs.setVisible = setVisible;
                // expand / collapse
                function expand(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        expandCollapse(tabNames, true);
                    }
                }
                Tabs.expand = expand;
                function collpase(tabNames, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        expandCollapse(tabNames, false);
                    }
                }
                Tabs.collpase = collpase;
                function expandCollapse(tabNames, value) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Tabs.expandCollapse", tabNames, value);
                    }
                    if (Array.isArray(tabNames)) {
                        for (var i = 0; i < tabNames.length; i++) {
                            var tab = get(tabNames[i], false);
                            if (tab) {
                                tab.setDisplayState(value ? "expanded" : "collapsed");
                            }
                        }
                    }
                    else {
                        Crm.Diagnostics.log.Warning("Tabs.expandCollapse: Invalid argument. An array was expected.");
                    }
                }
                Tabs.expandCollapse = expandCollapse;
            })(Tabs = Forms.Tabs || (Forms.Tabs = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
