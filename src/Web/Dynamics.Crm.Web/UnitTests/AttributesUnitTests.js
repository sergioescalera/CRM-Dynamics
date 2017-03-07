var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Attributes.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing attribute when not required", function () {
                    var attribute = Crm.Forms.Attributes.get("notAge", false);
                    expect(attribute).toBeNull();
                });
                it("Throws error for missing attribute when required", function () {
                    expect(function () { return Crm.Forms.Attributes.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing attribute when required by default", function () {
                    expect(function () { return Crm.Forms.Attributes.get("notAge"); }).toThrowError(Error);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
