var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Tabs.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing tab when not required", function () {
                    var tab = Crm.Forms.Tabs.get("invalidTab", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing tab when required", function () {
                    expect(function () { return Crm.Forms.Tabs.get("invalidTab", true); }).toThrowError(Error);
                });
                it("Throws error for missing tab when required by default", function () {
                    expect(function () { return Crm.Forms.Tabs.get("invalidTab"); }).toThrowError(Error);
                });
                it("Returns existing tab", function () {
                    var tab = Crm.Forms.Tabs.get("mainTab");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Tabs.setVisible", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing tab", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    expect(function () { return Crm.Forms.Tabs.show(["invalidTab"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Tabs.hide(["invalidTab"]); }).not.toThrowError();
                });
                it("Sets tab visibility to true", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    Crm.Forms.Tabs.show(["mainTab"]);
                    expect(mainTab.getVisible()).toBe(true);
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    Crm.Forms.Tabs.show(["mainTab"], true);
                    expect(mainTab.getVisible()).toBe(true);
                });
                it("Sets tab visibility to false", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.show(["mainTab"]);
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    expect(mainTab.getVisible()).toBe(false);
                    Crm.Forms.Tabs.show(["mainTab"]);
                    Crm.Forms.Tabs.hide(["mainTab"], true);
                    expect(mainTab.getVisible()).toBe(false);
                });
                it("Does not change tab visibility when condition is not satisfied", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    Crm.Forms.Tabs.show(["mainTab"], false);
                    expect(mainTab.getVisible()).toBe(false);
                    Crm.Forms.Tabs.show(["mainTab"]);
                    Crm.Forms.Tabs.hide(["mainTab"], false);
                    expect(mainTab.getVisible()).toBe(true);
                });
            });
            describe("Tabs.collapseExpand", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing tab", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    expect(function () { return Crm.Forms.Tabs.expand(["invalidTab"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Tabs.collpase(["invalidTab"]); }).not.toThrowError();
                });
                it("Sets tab to be expanded", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    Crm.Forms.Tabs.expand(["mainTab"], true);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                });
                it("Sets tab to be collapsed", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    Crm.Forms.Tabs.collpase(["mainTab"], true);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                });
                it("Does not change tab state when condition is not satisfied", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    Crm.Forms.Tabs.collpase(["mainTab"], false);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    Crm.Forms.Tabs.expand(["mainTab"], false);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=TabsUnitTests.js.map