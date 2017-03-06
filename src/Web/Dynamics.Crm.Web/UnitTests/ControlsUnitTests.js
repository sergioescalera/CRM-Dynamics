var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Controls.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing control when not required", function () {
                    var control = Crm.Forms.Controls.get("notAge", false);
                    expect(control).toBeNull();
                });
                it("Throws error for missing control when required", function () {
                    expect(function () { return Crm.Forms.Controls.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing control when required by default", function () {
                    expect(function () { return Crm.Forms.Controls.get("notAge"); }).toThrowError(Error);
                });
            });
            describe("Controls.setDisabled", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing control", function () {
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], true, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], false, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], true, false); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], false, false); }).not.toThrowError();
                });
                it("Sets all disabled", function () {
                    var control = window["Xrm"].Page.controls.age;
                    var header = window["Xrm"].Page.controls.age_header;
                    Crm.Forms.Controls.setDisabled(["age"], false, true);
                    Crm.Forms.Controls.setDisabled(["age"], true, true);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(true);
                });
                it("Sets control in body disabled", function () {
                    var control = window["Xrm"].Page.controls.age;
                    var header = window["Xrm"].Page.controls.age_header;
                    Crm.Forms.Controls.setDisabled(["age"], false, true);
                    Crm.Forms.Controls.setDisabled(["age"], true, false);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(false);
                });
            });
            describe("Controls.setVisible", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing control", function () {
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], true, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], false, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], true, false); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], false, false); }).not.toThrowError();
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=ControlsUnitTests.js.map