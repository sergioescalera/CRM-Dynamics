var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Sections.get", function () {
                it("Returns null for missing section when not required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var notatab = forms.sections.get("invalidTab", "invalidSection", false);
                    expect(notatab).toBeNull();
                    var tab = forms.sections.get("mainTab", "invalidSection", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing section when required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.sections.get("invalidTab", "invalidSection", true); }).toThrowError(Error);
                    expect(function () { return forms.sections.get("mainTab", "invalidSection", true); }).toThrowError(Error);
                });
                it("Throws error for missing section when required by default", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.sections.get("invalidTab", "invalidSection"); }).toThrowError(Error);
                    expect(function () { return forms.sections.get("mainTab", "invalidSection", true); }).toThrowError(Error);
                });
                it("Returns existing section", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var tab = forms.sections.get("mainTab", "mainSection");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Sections.setVisible", function () {
                it("Does not throw error for missing section", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var mainTab = page.mainTab;
                    expect(function () { return forms.sections.show(["invalidTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return forms.sections.hide(["invalidTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return forms.sections.show(["mainTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return forms.sections.hide(["mainTab|invalidSection"]); }).not.toThrowError();
                });
                it("Sets section visibility to true", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var mainSection = page.mainTab.mainSection;
                    forms.sections.hide(["mainTab|mainSection"]);
                    forms.sections.show(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(true);
                    forms.sections.hide(["mainTab|mainSection"]);
                    forms.sections.show(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(true);
                });
                it("Sets section visibility to false", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var mainSection = page.mainTab.mainSection;
                    forms.sections.show(["mainTab|mainSection"]);
                    forms.sections.hide(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(false);
                    forms.sections.show(["mainTab|mainSection"]);
                    forms.sections.hide(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(false);
                });
                it("Does not change section visibility when condition is not satisfied", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var mainSection = page.mainTab.mainSection;
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
