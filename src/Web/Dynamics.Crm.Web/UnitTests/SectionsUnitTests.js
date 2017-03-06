var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Sections.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing section when not required", function () {
                    var tab = Crm.Forms.Sections.get("invalidTab", "invalidSection", false);
                    expect(tab).toBeNull();
                    var tab = Crm.Forms.Sections.get("mainTab", "invalidSection", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing section when required", function () {
                    expect(function () { return Crm.Forms.Sections.get("invalidTab", "invalidSection", true); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Sections.get("mainTab", "invalidSection", true); }).toThrowError(Error);
                });
                it("Throws error for missing section when required by default", function () {
                    expect(function () { return Crm.Forms.Sections.get("invalidTab", "invalidSection"); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Sections.get("mainTab", "invalidSection", true); }).toThrowError(Error);
                });
                it("Returns existing section", function () {
                    var tab = Crm.Forms.Sections.get("mainTab", "mainSection");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Sections.setVisible", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing section", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    expect(function () { return Crm.Forms.Sections.show(["invalidTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Sections.hide(["invalidTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Sections.show(["mainTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Sections.hide(["mainTab|invalidSection"]); }).not.toThrowError();
                });
                it("Sets section visibility to true", function () {
                    var mainSection = window["Xrm"].Page.mainTab.mainSection;
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(true);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    Crm.Forms.Sections.show(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(true);
                });
                it("Sets section visibility to false", function () {
                    var mainSection = window["Xrm"].Page.mainTab.mainSection;
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(false);
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(false);
                });
                it("Does not change section visibility when condition is not satisfied", function () {
                    var mainSection = window["Xrm"].Page.mainTab.mainSection;
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    Crm.Forms.Sections.show(["mainTab|mainSection"], false);
                    expect(mainSection.getVisible()).toBe(false);
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"], false);
                    expect(mainSection.getVisible()).toBe(true);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=SectionsUnitTests.js.map