var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Validation.ensureNotNullOrUndefined", () => {
                it("Throws error for undefined argument", () => {
                    expect(() => Validation.ensureNotNullOrUndefined(undefined, undefined)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(undefined, null)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(undefined, "")).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(undefined, "abc")).toThrowError(Error);
                });
                it("Throws error for null argument", () => {
                    expect(() => Validation.ensureNotNullOrUndefined(null, undefined)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(null, null)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(null, "")).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(null, "abc")).toThrowError(Error);
                });
                it("Passes validation for non null or undefined values", () => {
                    expect(() => Validation.ensureNotNullOrUndefined("", undefined)).not.toThrowError();
                    expect(() => Validation.ensureNotNullOrUndefined(0, null)).not.toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined(new Date(), "")).not.toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined([], "abc")).not.toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrUndefined({}, "abc")).not.toThrowError(Error);
                });
            });
            describe("Validation.ensureNotNullOrEmpty", () => {
                it("Throws error for undefined argument", () => {
                    expect(() => Validation.ensureNotNullOrEmpty(undefined, undefined)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty(undefined, null)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty(undefined, "")).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty(undefined, "abc")).toThrowError(Error);
                });
                it("Throws error for null argument", () => {
                    expect(() => Validation.ensureNotNullOrEmpty(null, undefined)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty(null, null)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty(null, "")).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty(null, "abc")).toThrowError(Error);
                });
                it("Throws error for empty string argument", () => {
                    expect(() => Validation.ensureNotNullOrEmpty("", undefined)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty("", null)).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty("", "")).toThrowError(Error);
                    expect(() => Validation.ensureNotNullOrEmpty("", "abc")).toThrowError(Error);
                });
                it("Passes validation for non null or empty string values", () => {
                    expect(() => Validation.ensureNotNullOrEmpty("x", undefined)).not.toThrowError();
                    expect(() => Validation.ensureNotNullOrEmpty("xyz", null)).not.toThrowError();
                    expect(() => Validation.ensureNotNullOrEmpty("xyz", "")).not.toThrowError();
                    expect(() => Validation.ensureNotNullOrEmpty("xyz", "abc")).not.toThrowError();
                });
            });
            describe("Validation.ensureNumberInRange", () => {
                it("Throws error for undefined value", () => {
                    expect(() => Validation.ensureNumberInRange(undefined)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(undefined, 1)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(undefined, null, 1)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(undefined, 1, 1)).toThrowError(Error);
                });
                it("Throws error for null value", () => {
                    expect(() => Validation.ensureNumberInRange(null)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(null, 1)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(null, null, 1)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(null, 1, 1)).toThrowError(Error);
                });
                it("Throws error for non-numeric value", () => {
                    let func = Validation.ensureNumberInRange;
                    expect(() => func({})).toThrowError(Error);
                    expect(() => func("", 1)).toThrowError(Error);
                    expect(() => func([], null, 1)).toThrowError(Error);
                });
                it("Throws error for out of range numeric value", () => {
                    expect(() => Validation.ensureNumberInRange(0, 1)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(0, null, -1)).toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(0, 1, 2)).toThrowError(Error);
                });
                it("Passes validation for in range numeric value", () => {
                    expect(() => Validation.ensureNumberInRange(1.5, 1, 2)).not.toThrowError(Error);
                    expect(() => Validation.ensureNumberInRange(0, -1, 1)).not.toThrowError(Error);
                });
            });
            describe("Validation.Strings.left", () => {
                it("Does not throw error for null or undefined value", () => {
                    expect(() => Validation.Strings.left(undefined, 5)).not.toThrowError(Error);
                    expect(() => Validation.Strings.left(null, 5)).not.toThrowError(Error);
                });
                it("Returns specified number of chars from left side", () => {
                    expect(Validation.Strings.left("", 0)).toEqual("");
                    expect(Validation.Strings.left("", 5)).toEqual("");
                    expect(Validation.Strings.left("abc", 0)).toEqual("");
                    expect(Validation.Strings.left("abc", 1)).toEqual("a");
                    expect(Validation.Strings.left("abc", 2)).toEqual("ab");
                    expect(Validation.Strings.left("abc", 3)).toEqual("abc");
                    expect(Validation.Strings.left("abc", 5)).toEqual("abc");
                });
            });
            describe("Validation.Strings.right", () => {
                it("Does not throw error for null or undefined value", () => {
                    expect(() => Validation.Strings.right(undefined, 5)).not.toThrowError(Error);
                    expect(() => Validation.Strings.right(null, 5)).not.toThrowError(Error);
                });
                it("Returns specified number of chars from right side", () => {
                    expect(Validation.Strings.right("", 0)).toEqual("");
                    expect(Validation.Strings.right("", 5)).toEqual("");
                    expect(Validation.Strings.right("abc", 0)).toEqual("");
                    expect(Validation.Strings.right("abc", 1)).toEqual("c");
                    expect(Validation.Strings.right("abc", 2)).toEqual("bc");
                    expect(Validation.Strings.right("abc", 3)).toEqual("abc");
                    expect(Validation.Strings.right("abc", 5)).toEqual("abc");
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
