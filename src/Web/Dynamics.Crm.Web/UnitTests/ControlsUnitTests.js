var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Controls.get", function () {
                it("Returns null for missing control when not required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var control = forms.controls.get("notAge", false);
                    expect(control).toBeNull();
                });
                it("Throws error for missing control when required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.controls.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing control when required by default", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.controls.get("notAge"); }).toThrowError(Error);
                });
            });
            describe("Controls.setDisabled", function () {
                it("Does not throw error for missing control", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.controls.setDisabled(["notAge"], true, true); }).not.toThrowError();
                    expect(function () { return forms.controls.setDisabled(["notAge"], false, true); }).not.toThrowError();
                    expect(function () { return forms.controls.setDisabled(["notAge"], true, false); }).not.toThrowError();
                    expect(function () { return forms.controls.setDisabled(["notAge"], false, false); }).not.toThrowError();
                });
                it("Sets all disabled", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var control = page.controls.age;
                    var header = page.controls.age_header;
                    forms.controls.setDisabled(["age"], false, true);
                    forms.controls.setDisabled(["age"], true, true);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(true);
                });
                it("Sets control in body disabled", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var control = page.controls.age;
                    var header = page.controls.age_header;
                    forms.controls.setDisabled(["age"], false, true);
                    forms.controls.setDisabled(["age"], true, false);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(false);
                });
            });
            describe("Controls.setVisible", function () {
                it("Does not throw error for missing control", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.controls.setVisible(["notAge"], true, true); }).not.toThrowError();
                    expect(function () { return forms.controls.setVisible(["notAge"], false, true); }).not.toThrowError();
                    expect(function () { return forms.controls.setVisible(["notAge"], true, false); }).not.toThrowError();
                    expect(function () { return forms.controls.setVisible(["notAge"], false, false); }).not.toThrowError();
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
