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

            expect(() => Forms.Tabs.get("notAge", true)).toThrowError(Error);
        });

        it("Throws error for missing attribute when required by default", () => {

            expect(() => Forms.Tabs.get("notAge")).toThrowError(Error);
        });
    });
}