var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Controls.get", () => {
                it("Returns null for missing control when not required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let control = forms.controls.get("notAge", false);
                    expect(control).toBeNull();
                });
                it("Throws error for missing control when required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.controls.get("notAge", true)).toThrowError(Error);
                });
                it("Throws error for missing control when required by default", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.controls.get("notAge")).toThrowError(Error);
                });
            });
            describe("Controls.setDisabled", () => {
                it("Does not throw error for missing control", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.controls.setDisabled(["notAge"], true, true)).not.toThrowError();
                    expect(() => forms.controls.setDisabled(["notAge"], false, true)).not.toThrowError();
                    expect(() => forms.controls.setDisabled(["notAge"], true, false)).not.toThrowError();
                    expect(() => forms.controls.setDisabled(["notAge"], false, false)).not.toThrowError();
                });
                it("Sets all disabled", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let control = page.controls.age;
                    let header = page.controls.age_header;
                    forms.controls.setDisabled(["age"], false, true);
                    forms.controls.setDisabled(["age"], true, true);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(true);
                });
                it("Sets control in body disabled", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let control = page.controls.age;
                    let header = page.controls.age_header;
                    forms.controls.setDisabled(["age"], false, true);
                    forms.controls.setDisabled(["age"], true, false);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(false);
                });
            });
            describe("Controls.setVisible", () => {
                it("Does not throw error for missing control", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.controls.setVisible(["notAge"], true, true)).not.toThrowError();
                    expect(() => forms.controls.setVisible(["notAge"], false, true)).not.toThrowError();
                    expect(() => forms.controls.setVisible(["notAge"], true, false)).not.toThrowError();
                    expect(() => forms.controls.setVisible(["notAge"], false, false)).not.toThrowError();
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
