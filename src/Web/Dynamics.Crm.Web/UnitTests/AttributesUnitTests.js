var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Attributes.get", () => {
                it("Returns null for missing attribute when not required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let attribute = forms.attributes.get("notAge", false);
                    expect(attribute).toBeNull();
                });
                it("Throws error for missing attribute when required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.attributes.get("notAge", true)).toThrowError(Error);
                });
                it("Throws error for missing attribute when required by default", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.attributes.get("notAge")).toThrowError(Error);
                });
                it("Returns attribute", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let attribute = forms.attributes.get("age", false);
                    let expected = page.ageAttribute;
                    expect(attribute).toBeDefined();
                    expect(attribute).not.toBeNull();
                    expect(attribute).toBe(expected);
                });
            });
            describe("Attributes.setRequiredLevel", () => {
                it("Does not throw error for null or undefined array", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.attributes.setRequired(null)).not.toThrowError(Error);
                    expect(() => forms.attributes.setRequired(undefined)).not.toThrowError(Error);
                    expect(() => forms.attributes.setRequired([])).not.toThrowError(Error);
                    expect(() => forms.attributes.setOptional(null)).not.toThrowError(Error);
                    expect(() => forms.attributes.setOptional(undefined)).not.toThrowError(Error);
                    expect(() => forms.attributes.setOptional([])).not.toThrowError(Error);
                    expect(() => forms.attributes.setRecommended(null)).not.toThrowError(Error);
                    expect(() => forms.attributes.setRecommended(undefined)).not.toThrowError(Error);
                    expect(() => forms.attributes.setRecommended([])).not.toThrowError(Error);
                });
                it("Sets attribute required level to required", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let expected = page.ageAttribute;
                    forms.attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    forms.attributes.setOptional(["age"]);
                    forms.attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    forms.attributes.setRecommended(["age"]);
                    forms.attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                });
                it("Sets attribute required level to optional", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let expected = page.ageAttribute;
                    forms.attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    forms.attributes.setRequired(["age"]);
                    forms.attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    forms.attributes.setRecommended(["age"]);
                    forms.attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                });
                it("Sets attribute required level to recommended", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let expected = page.ageAttribute;
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
            describe("Attributes.notifications", () => {
                it("Throws error for null or undefined attribute", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    expect(() => forms.attributes.showNotification(null, "", "")).toThrowError(Error);
                    expect(() => forms.attributes.showNotification(null, "", "")).toThrowError(Error);
                    expect(() => forms.attributes.showNotification(undefined, "", "")).toThrowError(Error);
                    expect(() => forms.attributes.showNotification(undefined, "", "")).toThrowError(Error);
                });
                it("Shows/hides control notification", () => {
                    let page = new UnitTests.Mocks.PageMock();
                    let forms = new Crm.Forms(page);
                    let age = page.ageAttribute;
                    let controls = [
                        age.controls["age"],
                        age.controls["age_header"],
                        age.controls["age_footer"]
                    ].filter(c => !!c);
                    let msg = "Hello world!";
                    let id = "notif";
                    forms.attributes.showNotification(age, msg, id);
                    for (let i = 0; i < controls.length; i++) {
                        let control = controls[i];
                        expect(control.notifications[id]).toBe(msg);
                    }
                    forms.attributes.hideNotification(age, id);
                    for (let i = 0; i < controls.length; i++) {
                        let control = controls[i];
                        expect(control.notifications[id]).toBeNull();
                    }
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
