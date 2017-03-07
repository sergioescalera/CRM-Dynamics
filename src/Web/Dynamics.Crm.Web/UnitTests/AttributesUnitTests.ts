module Dynamics.Crm.UnitTests {

    "use strict";

    describe("Attributes.get", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Returns null for missing attribute when not required", () => {

            var attribute = Forms.Attributes.get("notAge", false);

            expect(attribute).toBeNull();
        });

        it("Throws error for missing attribute when required", () => {

            expect(() => Forms.Attributes.get("notAge", true)).toThrowError(Error);
        });

        it("Throws error for missing attribute when required by default", () => {

            expect(() => Forms.Attributes.get("notAge")).toThrowError(Error);
        });

        it("Returns attribute", () => {

            var attribute = Forms.Attributes.get("age", false);

            var expected = <Mocks.AttributeMock>window["Xrm"].Page.ageAttribute;

            expect(attribute).toBeDefined();
            expect(attribute).not.toBeNull();
            expect(attribute).toBe(expected);
        });
    });

    describe("Attributes.setRequiredLevel", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Does not throw error for null or undefined array", () => {

            expect(() => Forms.Attributes.setRequired(null)).not.toThrowError(Error);
            expect(() => Forms.Attributes.setRequired(undefined)).not.toThrowError(Error);
            expect(() => Forms.Attributes.setRequired([])).not.toThrowError(Error);
            expect(() => Forms.Attributes.setOptional(null)).not.toThrowError(Error);
            expect(() => Forms.Attributes.setOptional(undefined)).not.toThrowError(Error);
            expect(() => Forms.Attributes.setOptional([])).not.toThrowError(Error);
            expect(() => Forms.Attributes.setRecommended(null)).not.toThrowError(Error);
            expect(() => Forms.Attributes.setRecommended(undefined)).not.toThrowError(Error);
            expect(() => Forms.Attributes.setRecommended([])).not.toThrowError(Error);
        });

        it("Sets attribute required level to required", () => {

            var expected = <Mocks.AttributeMock>window["Xrm"].Page.ageAttribute;

            Forms.Attributes.setRequired(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");

            Forms.Attributes.setOptional(["age"]);
            Forms.Attributes.setRequired(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");

            Forms.Attributes.setRecommended(["age"]);
            Forms.Attributes.setRequired(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
        });

        it("Sets attribute required level to optional", () => {

            var expected = <Mocks.AttributeMock>window["Xrm"].Page.ageAttribute;

            Forms.Attributes.setOptional(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");

            Forms.Attributes.setRequired(["age"]);
            Forms.Attributes.setOptional(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");

            Forms.Attributes.setRecommended(["age"]);
            Forms.Attributes.setOptional(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
        });

        it("Sets attribute required level to recommended", () => {

            var expected = <Mocks.AttributeMock>window["Xrm"].Page.ageAttribute;

            Forms.Attributes.setRecommended(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");

            Forms.Attributes.setOptional(["age"]);
            Forms.Attributes.setRecommended(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");

            Forms.Attributes.setRequired(["age"]);
            Forms.Attributes.setRecommended(["age"]);

            expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
        });
    });

    describe("Attributes.notifications", () => {

        beforeEach(() => {
            window["Xrm"] = { Page: new Mocks.PageMock() };
        });

        afterEach(() => {
            window["Xrm"] = undefined;
        });

        it("Throws error for null or undefined attribute", () => {

            expect(() => Forms.Attributes.showNotification(null, "", "")).toThrowError(Error);
            expect(() => Forms.Attributes.showNotification(null, "", "")).toThrowError(Error);
            expect(() => Forms.Attributes.showNotification(undefined, "", "")).toThrowError(Error);
            expect(() => Forms.Attributes.showNotification(undefined, "", "")).toThrowError(Error);
        });

        it("Shows/hides control notification", () => {
            
            var age = window["Xrm"].Page.ageAttribute;
            var controls = [
                age.controls["age"],
                age.controls["age_header"],
                age.controls["age_footer"]
            ].filter(c => !!c);
            var msg = "Hello world!";
            var id = "notif";

            Forms.Attributes.showNotification(age, msg, id);

            for (var i = 0; i < controls.length; i++) {

                var control = controls[i];

                expect(control.notifications[id]).toBe(msg);
            }

            Forms.Attributes.hideNotification(age, id);

            for (var i = 0; i < controls.length; i++) {

                var control = controls[i];

                expect(control.notifications[id]).toBeNull();
            }
        });
    });
}