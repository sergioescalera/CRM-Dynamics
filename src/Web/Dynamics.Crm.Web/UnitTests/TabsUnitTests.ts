module Dynamics.Crm.UnitTests {

    "use strict";

    describe("Tabs.get", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Returns null for missing tab when not required", () => {

            var tab = Forms.Tabs.get("invalidTab", false);

            expect(tab).toBeNull();
        });

        it("Throws error for missing tab when required", () => {

            expect(() => Forms.Tabs.get("invalidTab", true)).toThrowError(Error);
        });

        it("Throws error for missing tab when required by default", () => {

            expect(() => Forms.Tabs.get("invalidTab")).toThrowError(Error);
        });

        it("Returns existing tab", () => {

            var tab = Forms.Tabs.get("mainTab");

            expect(tab).toBeDefined();
            expect(tab).not.toBeNull();
        });
    });

    describe("Tabs.setVisible", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Does not throw error for missing tab", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            expect(() => Forms.Tabs.show(["invalidTab"])).not.toThrowError();
            expect(() => Forms.Tabs.hide(["invalidTab"])).not.toThrowError();
        });

        it("Sets tab visibility to true", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            Forms.Tabs.hide(["mainTab"]);
            Forms.Tabs.show(["mainTab"]);

            expect(mainTab.getVisible()).toBe(true);

            Forms.Tabs.hide(["mainTab"]);
            Forms.Tabs.show(["mainTab"], true);

            expect(mainTab.getVisible()).toBe(true);

        });

        it("Sets tab visibility to false", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            Forms.Tabs.show(["mainTab"]);
            Forms.Tabs.hide(["mainTab"]);

            expect(mainTab.getVisible()).toBe(false);

            Forms.Tabs.show(["mainTab"]);
            Forms.Tabs.hide(["mainTab"], true);

            expect(mainTab.getVisible()).toBe(false);
        });

        it("Does not change tab visibility when condition is not satisfied", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            Forms.Tabs.hide(["mainTab"]);
            Forms.Tabs.show(["mainTab"], false);

            expect(mainTab.getVisible()).toBe(false);

            Forms.Tabs.show(["mainTab"]);
            Forms.Tabs.hide(["mainTab"], false);

            expect(mainTab.getVisible()).toBe(true);
        });
    });

    describe("Tabs.collapseExpand", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Does not throw error for missing tab", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            expect(() => Forms.Tabs.expand(["invalidTab"])).not.toThrowError();
            expect(() => Forms.Tabs.collpase(["invalidTab"])).not.toThrowError();            
        });

        it("Sets tab to be expanded", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            Forms.Tabs.collpase(["mainTab"]);
            Forms.Tabs.expand(["mainTab"]);

            expect(mainTab.getDisplayState()).toBe("expanded");

            Forms.Tabs.collpase(["mainTab"]);
            Forms.Tabs.expand(["mainTab"], true);

            expect(mainTab.getDisplayState()).toBe("expanded");
        });

        it("Sets tab to be collapsed", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            Forms.Tabs.expand(["mainTab"]);
            Forms.Tabs.collpase(["mainTab"]);

            expect(mainTab.getDisplayState()).toBe("collapsed");

            Forms.Tabs.expand(["mainTab"]);
            Forms.Tabs.collpase(["mainTab"], true);

            expect(mainTab.getDisplayState()).toBe("collapsed");
        });

        it("Does not change tab state when condition is not satisfied", () => {

            var mainTab = window["Xrm"].Page.mainTab;

            Forms.Tabs.expand(["mainTab"]);
            Forms.Tabs.collpase(["mainTab"], false);

            expect(mainTab.getDisplayState()).toBe("expanded");

            Forms.Tabs.collpase(["mainTab"]);
            Forms.Tabs.expand(["mainTab"], false);

            expect(mainTab.getDisplayState()).toBe("collapsed");
        });
    });
}