var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Tabs.get", () => {
                it("Returns null for missing tab when not required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let tab = forms.tabs.get("invalidTab", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing tab when required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.tabs.get("invalidTab", true)).toThrowError(Error);
                });
                it("Throws error for missing tab when required by default", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.tabs.get("invalidTab")).toThrowError(Error);
                });
                it("Returns existing tab", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let tab = forms.tabs.get("mainTab");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Tabs.setVisible", () => {
                it("Does not throw error for missing tab", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    expect(() => forms.tabs.show(["invalidTab"])).not.toThrowError();
                    expect(() => forms.tabs.hide(["invalidTab"])).not.toThrowError();
                });
                it("Sets tab visibility to true", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    forms.tabs.hide(["mainTab"]);
                    forms.tabs.show(["mainTab"]);
                    expect(mainTab.getVisible()).toBe(true);
                    forms.tabs.hide(["mainTab"]);
                    forms.tabs.show(["mainTab"], true);
                    expect(mainTab.getVisible()).toBe(true);
                });
                it("Sets tab visibility to false", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    forms.tabs.show(["mainTab"]);
                    forms.tabs.hide(["mainTab"]);
                    expect(mainTab.getVisible()).toBe(false);
                    forms.tabs.show(["mainTab"]);
                    forms.tabs.hide(["mainTab"], true);
                    expect(mainTab.getVisible()).toBe(false);
                });
                it("Does not change tab visibility when condition is not satisfied", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    forms.tabs.hide(["mainTab"]);
                    forms.tabs.show(["mainTab"], false);
                    expect(mainTab.getVisible()).toBe(false);
                    forms.tabs.show(["mainTab"]);
                    forms.tabs.hide(["mainTab"], false);
                    expect(mainTab.getVisible()).toBe(true);
                });
            });
            describe("Tabs.collapseExpand", () => {
                it("Does not throw error for missing tab", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    expect(() => forms.tabs.expand(["invalidTab"])).not.toThrowError();
                    expect(() => forms.tabs.collpase(["invalidTab"])).not.toThrowError();
                });
                it("Sets tab to be expanded", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    forms.tabs.collpase(["mainTab"]);
                    forms.tabs.expand(["mainTab"]);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                    forms.tabs.collpase(["mainTab"]);
                    forms.tabs.expand(["mainTab"], true);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                });
                it("Sets tab to be collapsed", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    forms.tabs.expand(["mainTab"]);
                    forms.tabs.collpase(["mainTab"]);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                    forms.tabs.expand(["mainTab"]);
                    forms.tabs.collpase(["mainTab"], true);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                });
                it("Does not change tab state when condition is not satisfied", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    forms.tabs.expand(["mainTab"]);
                    forms.tabs.collpase(["mainTab"], false);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                    forms.tabs.collpase(["mainTab"]);
                    forms.tabs.expand(["mainTab"], false);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
