var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("CacheService.get", () => {
                it("Throws error for null key", () => {
                    let cache = new Caching.CacheService();
                    expect(() => cache.get(null)).toThrowError(Error);
                });
                it("Throws error for undefined key", () => {
                    let cache = new Caching.CacheService();
                    expect(() => cache.get(undefined)).toThrowError(Error);
                });
                it("Returns null for missing key", () => {
                    let cache = new Caching.CacheService();
                    let key = "key";
                    let cached = cache.get(key);
                    expect(cached).toBeDefined();
                    expect(cached).toBeNull();
                });
            });
            describe("CacheService.set", () => {
                it("Throws error for null key", () => {
                    let cache = new Caching.CacheService();
                    expect(() => cache.set(null, {})).toThrowError(Error);
                });
                it("Throws error for undefined key", () => {
                    let cache = new Caching.CacheService();
                    expect(() => cache.set(undefined, {})).toThrowError(Error);
                });
            });
            describe("CacheService.get/CacheService.set", () => {
                it("Returns null if expired", (done) => {
                    let cache = new Caching.CacheService();
                    let key = "key";
                    let value = { name: "This is a test object" };
                    let sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(() => {
                        let cached = cache.get(key);
                        expect(cached).toBeDefined();
                        expect(cached).toBeNull();
                        done();
                    }, 1500);
                });
                it("Returns new item if expired when a factory function is provided", (done) => {
                    let cache = new Caching.CacheService();
                    let key = "key";
                    let counter = 0;
                    let factory = () => { return { n: ++counter }; };
                    let value = factory();
                    let sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(() => {
                        let cached = cache.get(key, factory);
                        expect(cached).toBeDefined();
                        expect(cached).not.toBeNull();
                        expect(cached.n).not.toBe(value.n);
                        expect(cached.n).toBe(counter);
                        done();
                    }, 1500);
                });
                it("Returns cached item", (done) => {
                    let cache = new Caching.CacheService();
                    let key = "key";
                    let value = { name: "This is a test object" };
                    let sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(() => {
                        let cached = cache.get(key);
                        expect(cached).toBeDefined();
                        expect(cached).not.toBeNull();
                        expect(cached.name).toBeDefined();
                        expect(cached.name).not.toBeNull();
                        expect(cached.name).toBe(value.name);
                        done();
                    }, 500);
                });
                it("Overrides cached item", () => {
                    let cache = new Caching.CacheService();
                    let key = "key";
                    let sec = 1;
                    cache.set(key, 1, sec);
                    cache.set(key, 2, sec);
                    let cached = cache.get(key);
                    expect(cached).toBeDefined();
                    expect(cached).not.toBeNull();
                    expect(cached).not.toBe(1);
                    expect(cached).toBe(2);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
