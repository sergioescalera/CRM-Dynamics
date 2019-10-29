var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var Sections = /** @class */ (function () {
            function Sections(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.tabs = new Crm.Tabs(page);
            }
            Sections.prototype.get = function (tabName, sectionName, required) {
                if (required === void 0) { required = true; }
                var tab = this.tabs.get(tabName, required);
                if (!tab) {
                    return null;
                }
                var section = tab.sections.get(sectionName);
                if (section) {
                    return section;
                }
                var msg = "The specified section could not be found: " + tabName + " - " + sectionName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            };
            Sections.prototype.show = function (names, condition) {
                if (condition === void 0) { condition = true; }
                if (condition) {
                    this.setVisible(names, true);
                }
            };
            Sections.prototype.hide = function (names, condition) {
                if (condition === void 0) { condition = true; }
                if (condition) {
                    this.setVisible(names, false);
                }
            };
            Sections.prototype.setVisible = function (names, value) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Sections.setVisible", names, value);
                }
                if (Array.isArray(names)) {
                    for (var i = 0; i < names.length; i++) {
                        var name_1 = names[i];
                        var pair = name_1.split("|");
                        var section = void 0;
                        if (pair && pair.length === 2) {
                            section = this.get(pair[0], pair[1], false);
                        }
                        if (section) {
                            section.setVisible(value);
                        }
                    }
                }
                else {
                    Crm.Diagnostics.log.Warning("Sections.setVisible: Invalid argument. An array was expected.");
                }
            };
            return Sections;
        }());
        Crm.Sections = Sections;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
