module Dynamics.Crm.Forms.Sections {

    "use strict";

    export function get(tabName: string, sectionName: string, required: boolean = true): Section {

        var tab = Tabs.get(tabName, required);

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

        Diagnostics.log.Message(msg);

        return null;
    }
}