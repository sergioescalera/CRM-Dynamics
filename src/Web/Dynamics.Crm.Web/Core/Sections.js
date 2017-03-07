var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            var Sections;
            (function (Sections) {
                "use strict";
                function get(tabName, sectionName, required) {
                    if (required === void 0) { required = true; }
                    var tab = Forms.Tabs.get(tabName, required);
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
                }
                Sections.get = get;
                function show(names, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(names, true);
                    }
                }
                Sections.show = show;
                function hide(names, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition) {
                        setVisible(names, false);
                    }
                }
                Sections.hide = hide;
                function setVisible(names, value) {
                    if (Crm.Diagnostics.trace) {
                        Crm.Diagnostics.printArguments("Sections.setVisible", names, value);
                    }
                    if (Array.isArray(names)) {
                        for (var i = 0; i < names.length; i++) {
                            var name = names[i];
                            var pair = name.split("|");
                            var section;
                            if (pair && pair.length === 2) {
                                section = get(pair[0], pair[1], false);
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
                Sections.setVisible = setVisible;
            })(Sections = Forms.Sections || (Forms.Sections = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
