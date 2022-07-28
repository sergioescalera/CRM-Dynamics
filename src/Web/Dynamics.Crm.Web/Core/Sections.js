var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        class Sections {
            constructor(page) {
                Validation.ensureNotNullOrUndefined(page, "page");
                this.page = page;
                this.tabs = new Crm.Tabs(page);
            }
            get(tabName, sectionName, required = true) {
                let tab = this.tabs.get(tabName, required);
                if (!tab) {
                    return null;
                }
                let section = tab.sections.get(sectionName);
                if (section) {
                    return section;
                }
                let msg = "The specified section could not be found: " + tabName + " - " + sectionName;
                if (required) {
                    throw new Error(msg);
                }
                Crm.Diagnostics.log.Message(msg);
                return null;
            }
            show(names, condition = true) {
                if (condition) {
                    this.setVisible(names, true);
                }
            }
            hide(names, condition = true) {
                if (condition) {
                    this.setVisible(names, false);
                }
            }
            setVisible(names, value) {
                if (Crm.Diagnostics.trace) {
                    Crm.Diagnostics.printArguments("Sections.setVisible", names, value);
                }
                if (Array.isArray(names)) {
                    for (let i = 0; i < names.length; i++) {
                        let name = names[i];
                        let pair = name.split("|");
                        let section;
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
            }
        }
        Crm.Sections = Sections;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
