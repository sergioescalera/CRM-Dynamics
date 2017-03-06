module Dynamics.Crm.UnitTests {

    "use strict";

    describe("Controls.get", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Returns null for missing control when not required", () => {

            var control = Forms.Controls.get("notAge", false);

            expect(control).toBeNull();
        });

        it("Throws error for missing control when required", () => {

            expect(() => Forms.Controls.get("notAge", true)).toThrowError(Error);
        });

        it("Throws error for missing control when required by default", () => {

            expect(() => Forms.Controls.get("notAge")).toThrowError(Error);
        });
    });

    describe("Controls.setDisabled", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Does not throw error for missing control", () => {
            
            expect(() => Forms.Controls.setDisabled(["notAge"], true, true)).not.toThrowError();
            expect(() => Forms.Controls.setDisabled(["notAge"], false, true)).not.toThrowError();
            expect(() => Forms.Controls.setDisabled(["notAge"], true, false)).not.toThrowError();
            expect(() => Forms.Controls.setDisabled(["notAge"], false, false)).not.toThrowError();
        });

        it("Sets all disabled", () => {

            var control = window["Xrm"].Page.controls.age;
            var header = window["Xrm"].Page.controls.age_header;

            Forms.Controls.setDisabled(["age"], false, true);
            Forms.Controls.setDisabled(["age"], true, true);

            expect(control.getDisabled()).toBe(true);
            expect(header.getDisabled()).toBe(true);
        });

        it("Sets control in body disabled", () => {

            var control = window["Xrm"].Page.controls.age;
            var header = window["Xrm"].Page.controls.age_header;

            Forms.Controls.setDisabled(["age"], false, true);
            Forms.Controls.setDisabled(["age"], true, false);

            expect(control.getDisabled()).toBe(true);
            expect(header.getDisabled()).toBe(false);
        });
    });

    describe("Controls.setVisible", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Does not throw error for missing control", () => {

            expect(() => Forms.Controls.setVisible(["notAge"], true, true)).not.toThrowError();
            expect(() => Forms.Controls.setVisible(["notAge"], false, true)).not.toThrowError();
            expect(() => Forms.Controls.setVisible(["notAge"], true, false)).not.toThrowError();
            expect(() => Forms.Controls.setVisible(["notAge"], false, false)).not.toThrowError();
        });
    });
}