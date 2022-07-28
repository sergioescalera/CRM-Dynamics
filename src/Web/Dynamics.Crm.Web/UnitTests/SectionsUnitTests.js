var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Sections.get", () => {
                it("Returns null for missing section when not required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let notatab = forms.sections.get("invalidTab", "invalidSection", false);
                    expect(notatab).toBeNull();
                    let tab = forms.sections.get("mainTab", "invalidSection", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing section when required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.sections.get("invalidTab", "invalidSection", true)).toThrowError(Error);
                    expect(() => forms.sections.get("mainTab", "invalidSection", true)).toThrowError(Error);
                });
                it("Throws error for missing section when required by default", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.sections.get("invalidTab", "invalidSection")).toThrowError(Error);
                    expect(() => forms.sections.get("mainTab", "invalidSection", true)).toThrowError(Error);
                });
                it("Returns existing section", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let tab = forms.sections.get("mainTab", "mainSection");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Sections.setVisible", () => {
                it("Does not throw error for missing section", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainTab = page.mainTab;
                    expect(() => forms.sections.show(["invalidTab|invalidSection"])).not.toThrowError();
                    expect(() => forms.sections.hide(["invalidTab|invalidSection"])).not.toThrowError();
                    expect(() => forms.sections.show(["mainTab|invalidSection"])).not.toThrowError();
                    expect(() => forms.sections.hide(["mainTab|invalidSection"])).not.toThrowError();
                });
                it("Sets section visibility to true", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainSection = page.mainTab.mainSection;
                    forms.sections.hide(["mainTab|mainSection"]);
                    forms.sections.show(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(true);
                    forms.sections.hide(["mainTab|mainSection"]);
                    forms.sections.show(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(true);
                });
                it("Sets section visibility to false", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainSection = page.mainTab.mainSection;
                    forms.sections.show(["mainTab|mainSection"]);
                    forms.sections.hide(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(false);
                    forms.sections.show(["mainTab|mainSection"]);
                    forms.sections.hide(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(false);
                });
                it("Does not change section visibility when condition is not satisfied", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let mainSection = page.mainTab.mainSection;
                    forms.sections.hide(["mainTab|mainSection"]);
                    forms.sections.show(["mainTab|mainSection"], false);
                    expect(mainSection.getVisible()).toBe(false);
                    forms.sections.show(["mainTab|mainSection"]);
                    forms.sections.hide(["mainTab|mainSection"], false);
                    expect(mainSection.getVisible()).toBe(true);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
