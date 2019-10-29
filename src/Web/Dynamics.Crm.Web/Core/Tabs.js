var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var Tabs = /** @class */ (function () {
            function Tabs(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
            }
            Tabs.prototype.get = function (tabName, required) {
                if (required === void 0) { required = true; }
                var tab = this.page.ui.tabs.get(tabName);
                if (tab) {
                    return tab;
                }
                var msg = "The specified tab could not be found: " + tabName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            };
            // show / hide
            Tabs.prototype.show = function (tabNames, condition) {
                if (condition === void 0) { condition = true; }
                if (condition) {
                    this.setVisible(tabNames, true);
                }
            };
            Tabs.prototype.hide = function (tabNames, condition) {
                if (condition === void 0) { condition = true; }
                if (condition) {
                    this.setVisible(tabNames, false);
                }
            };
            Tabs.prototype.setVisible = function (tabNames, value) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tabs.setVisible", tabNames, value);
                }
                if (Array.isArray(tabNames)) {
                    for (var i = 0; i < tabNames.length; i++) {
                        var tab = this.get(tabNames[i], false);
                        if (tab) {
                            tab.setVisible(value);
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Tabs.setVisible: Invalid argument. An array was expected.");
                }
            };
            // expand / collapse
            Tabs.prototype.expand = function (tabNames, condition) {
                if (condition === void 0) { condition = true; }
                if (condition) {
                    this.expandCollapse(tabNames, true);
                }
            };
            Tabs.prototype.collpase = function (tabNames, condition) {
                if (condition === void 0) { condition = true; }
                if (condition) {
                    this.expandCollapse(tabNames, false);
                }
            };
            Tabs.prototype.expandCollapse = function (tabNames, value) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Tabs.expandCollapse", tabNames, value);
                }
                if (Array.isArray(tabNames)) {
                    for (var i = 0; i < tabNames.length; i++) {
                        var tab = this.get(tabNames[i], false);
                        if (tab) {
                            tab.setDisplayState(value ? "expanded" : "collapsed");
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Tabs.expandCollapse: Invalid argument. An array was expected.");
                }
            };
            return Tabs;
        }());
        Crm.Tabs = Tabs;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
