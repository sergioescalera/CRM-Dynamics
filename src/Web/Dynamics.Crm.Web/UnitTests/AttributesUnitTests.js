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
                it("Returns attribute", function () {
                    var attribute = Crm.Forms.Attributes.get("age", false);
                    var expected = window["Xrm"].Page.ageAttribute;
                    expect(attribute).toBeDefined();
                    expect(attribute).not.toBeNull();
                    expect(attribute).toBe(expected);
                });
            });
            describe("Attributes.setRequiredLevel", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for null or undefined array", function () {
                    expect(function () { return Crm.Forms.Attributes.setRequired(null); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRequired(undefined); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRequired([]); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setOptional(null); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setOptional(undefined); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setOptional([]); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRecommended(null); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRecommended(undefined); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRecommended([]); }).not.toThrowError(Error);
                });
                it("Sets attribute required level to required", function () {
                    var expected = window["Xrm"].Page.ageAttribute;
                    Crm.Forms.Attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    Crm.Forms.Attributes.setOptional(["age"]);
                    Crm.Forms.Attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    Crm.Forms.Attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                });
                it("Sets attribute required level to optional", function () {
                    var expected = window["Xrm"].Page.ageAttribute;
                    Crm.Forms.Attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    Crm.Forms.Attributes.setRequired(["age"]);
                    Crm.Forms.Attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    Crm.Forms.Attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                });
                it("Sets attribute required level to recommended", function () {
                    var expected = window["Xrm"].Page.ageAttribute;
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                    Crm.Forms.Attributes.setOptional(["age"]);
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                    Crm.Forms.Attributes.setRequired(["age"]);
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                });
            });
            describe("Attributes.notifications", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Throws error for null or undefined attribute", function () {
                    expect(function () { return Crm.Forms.Attributes.showNotification(null, "", ""); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.showNotification(null, "", ""); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.showNotification(undefined, "", ""); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.showNotification(undefined, "", ""); }).toThrowError(Error);
                });
                it("Shows/hides control notification", function () {
                    var age = window["Xrm"].Page.ageAttribute;
                    var controls = [
                        age.controls["age"],
                        age.controls["age_header"],
                        age.controls["age_footer"]
                    ].filter(function (c) { return !!c; });
                    var msg = "Hello world!";
                    var id = "notif";
                    Crm.Forms.Attributes.showNotification(age, msg, id);
                    for (var i = 0; i < controls.length; i++) {
                        var control = controls[i];
                        expect(control.notifications[id]).toBe(msg);
                    }
                    Crm.Forms.Attributes.hideNotification(age, id);
                    for (var i = 0; i < controls.length; i++) {
                        var control = controls[i];
                        expect(control.notifications[id]).toBeNull();
                    }
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
