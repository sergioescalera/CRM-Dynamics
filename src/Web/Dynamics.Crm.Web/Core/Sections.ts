module Dynamics.Crm.Forms.Sections {

    "use strict";

    export function get(tabName: string, sectionName: string, required: boolean = true): Section {

        let tab = Tabs.get(tabName, required);

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

        Diagnostics.log.Message(msg);

        return null;
    }

    export function show(names: string[], condition: boolean = true): void {

        if (condition) {
            setVisible(names, true);
        }
    }

    export function hide(names: string[], condition: boolean = true): void {

        if (condition) {
            setVisible(names, false);
        }
    }

    export function setVisible(names: string[], value: boolean): void {

        if (Diagnostics.trace) {
            Diagnostics.printArguments("Sections.setVisible", names, value);
        }

        if (Array.isArray(names)) {

            for (let i = 0; i < names.length; i++) {

                let name: string = names[i];
                let pair = name.split("|");
                let section;

                if (pair && pair.length === 2) {
                    section = get(pair[0], pair[1], false);
                }

                if (section) {
                    section.setVisible(value);
                }
            }

        } else {

            Diagnostics.log.Warning("Sections.setVisible: Invalid argument. An array was expected.");
        }
    }
}