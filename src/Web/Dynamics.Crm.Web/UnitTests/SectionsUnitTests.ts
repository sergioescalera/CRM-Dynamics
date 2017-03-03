module Dynamics.Crm.UnitTests {

    "use strict";

    describe("Sections.get", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Returns null for missing section when not required", () => {

            var tab = Forms.Sections.get("invalidTab", "invalidSection", false);

            expect(tab).toBeNull();

            var tab = Forms.Sections.get("mainTab", "invalidSection", false);

            expect(tab).toBeNull();
        });

        it("Throws error for missing section when required", () => {

            expect(() => Forms.Sections.get("invalidTab", "invalidSection", true)).toThrowError(Error);

            expect(() => Forms.Sections.get("mainTab", "invalidSection", true)).toThrowError(Error);
        });

        it("Throws error for missing section when required by default", () => {

            expect(() => Forms.Sections.get("invalidTab", "invalidSection")).toThrowError(Error);

            expect(() => Forms.Sections.get("mainTab", "invalidSection", true)).toThrowError(Error);
        });

        it("Returns existing section", () => {

            var tab = Forms.Sections.get("mainTab", "mainSection");

            expect(tab).toBeDefined();
            expect(tab).not.toBeNull();
        });
    });

    describe("Sections.setVisible", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Does not throw error for missing section", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            expect(() => Forms.Sections.show(["invalidTab|invalidSection"])).not.toThrowError();
            expect(() => Forms.Sections.hide(["invalidTab|invalidSection"])).not.toThrowError();
            expect(() => Forms.Sections.show(["mainTab|invalidSection"])).not.toThrowError();
            expect(() => Forms.Sections.hide(["mainTab|invalidSection"])).not.toThrowError();
        });

        it("Sets section visibility to true", () => {

            var mainSection = window["Xrm"].Page.mainTab.mainSection;

            Forms.Sections.hide(["mainTab|mainSection"]);
            Forms.Sections.show(["mainTab|mainSection"]);

            expect(mainSection.getVisible()).toBe(true);

            Forms.Sections.hide(["mainTab|mainSection"]);
            Forms.Sections.show(["mainTab|mainSection"], true);

            expect(mainSection.getVisible()).toBe(true);

        });

        it("Sets section visibility to false", () => {

            var mainSection = window["Xrm"].Page.mainTab.mainSection;

            Forms.Sections.show(["mainTab|mainSection"]);
            Forms.Sections.hide(["mainTab|mainSection"]);

            expect(mainSection.getVisible()).toBe(false);

            Forms.Sections.show(["mainTab|mainSection"]);
            Forms.Sections.hide(["mainTab|mainSection"], true);

            expect(mainSection.getVisible()).toBe(false);
        });

        it("Does not change section visibility when condition is not satisfied", () => {

            var mainSection = window["Xrm"].Page.mainTab.mainSection;

            Forms.Sections.hide(["mainTab|mainSection"]);
            Forms.Sections.show(["mainTab|mainSection"], false);

            expect(mainSection.getVisible()).toBe(false);

            Forms.Sections.show(["mainTab|mainSection"]);
            Forms.Sections.hide(["mainTab|mainSection"], false);

            expect(mainSection.getVisible()).toBe(true);
        });
    });
}