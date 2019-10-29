var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Attributes.get", function () {
                it("Returns null for missing attribute when not required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var attribute = forms.attributes.get("notAge", false);
                    expect(attribute).toBeNull();
                });
                it("Throws error for missing attribute when required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.attributes.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing attribute when required by default", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.attributes.get("notAge"); }).toThrowError(Error);
                });
                it("Returns attribute", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var attribute = forms.attributes.get("age", false);
                    var expected = page.ageAttribute;
                    expect(attribute).toBeDefined();
                    expect(attribute).not.toBeNull();
                    expect(attribute).toBe(expected);
                });
            });
            describe("Attributes.setRequiredLevel", function () {
                it("Does not throw error for null or undefined array", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.attributes.setRequired(null); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setRequired(undefined); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setRequired([]); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setOptional(null); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setOptional(undefined); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setOptional([]); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setRecommended(null); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setRecommended(undefined); }).not.toThrowError(Error);
                    expect(function () { return forms.attributes.setRecommended([]); }).not.toThrowError(Error);
                });
                it("Sets attribute required level to required", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var expected = page.ageAttribute;
                    forms.attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    forms.attributes.setOptional(["age"]);
                    forms.attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    forms.attributes.setRecommended(["age"]);
                    forms.attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                });
                it("Sets attribute required level to optional", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var expected = page.ageAttribute;
                    forms.attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    forms.attributes.setRequired(["age"]);
                    forms.attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    forms.attributes.setRecommended(["age"]);
                    forms.attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                });
                it("Sets attribute required level to recommended", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var expected = page.ageAttribute;
                    forms.attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                    forms.attributes.setOptional(["age"]);
                    forms.attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                    forms.attributes.setRequired(["age"]);
                    forms.attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                });
            });
            describe("Attributes.notifications", function () {
                it("Throws error for null or undefined attribute", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    expect(function () { return forms.attributes.showNotification(null, "", ""); }).toThrowError(Error);
                    expect(function () { return forms.attributes.showNotification(null, "", ""); }).toThrowError(Error);
                    expect(function () { return forms.attributes.showNotification(undefined, "", ""); }).toThrowError(Error);
                    expect(function () { return forms.attributes.showNotification(undefined, "", ""); }).toThrowError(Error);
                });
                it("Shows/hides control notification", function () {
                    var page = new UnitTests.Mocks.PageMock();
                    var forms = new Crm.Forms(page);
                    var age = page.ageAttribute;
                    var controls = [
                        age.controls["age"],
                        age.controls["age_header"],
                        age.controls["age_footer"]
                    ].filter(function (c) { return !!c; });
                    var msg = "Hello world!";
                    var id = "notif";
                    forms.attributes.showNotification(age, msg, id);
                    for (var i = 0; i < controls.length; i++) {
                        var control = controls[i];
                        expect(control.notifications[id]).toBe(msg);
                    }
                    forms.attributes.hideNotification(age, id);
                    for (var i = 0; i < controls.length; i++) {
                        var control = controls[i];
                        expect(control.notifications[id]).toBeNull();
                    }
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
