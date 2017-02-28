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
            })(Sections = Forms.Sections || (Forms.Sections = {}));
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
