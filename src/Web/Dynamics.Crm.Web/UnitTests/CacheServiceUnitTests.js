var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("CacheService.get", function () {
                it("Throws error for null key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.get(null); }).toThrowError(Error);
                });
                it("Throws error for undefined key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.get(undefined); }).toThrowError(Error);
                });
                it("Returns null for missing key", function () {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var cached = cache.get(key);
                    expect(cached).toBeDefined();
                    expect(cached).toBeNull();
                });
            });
            describe("CacheService.set", function () {
                it("Throws error for null key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.set(null, {}); }).toThrowError(Error);
                });
                it("Throws error for undefined key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.set(undefined, {}); }).toThrowError(Error);
                });
            });
            describe("CacheService.get/CacheService.set", function () {
                it("Returns null if expired", function (done) {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var value = { name: "This is a test object" };
                    var sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(function () {
                        var cached = cache.get(key);
                        expect(cached).toBeDefined();
                        expect(cached).toBeNull();
                        done();
                    }, 1500);
                });
                it("Returns new item if expired when a factory function is provided", function (done) {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var counter = 0;
                    var factory = function () { return { n: ++counter }; };
                    var value = factory();
                    var sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(function () {
                        var cached = cache.get(key, factory);
                        expect(cached).toBeDefined();
                        expect(cached).not.toBeNull();
                        expect(cached.n).not.toBe(value.n);
                        expect(cached.n).toBe(counter);
                        done();
                    }, 1500);
                });
                it("Returns cached item", function (done) {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var value = { name: "This is a test object" };
                    var sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(function () {
                        var cached = cache.get(key);
                        expect(cached).toBeDefined();
                        expect(cached).not.toBeNull();
                        expect(cached.name).toBeDefined();
                        expect(cached.name).not.toBeNull();
                        expect(cached.name).toBe(value.name);
                        done();
                    }, 500);
                });
                it("Overrides cached item", function () {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var sec = 1;
                    cache.set(key, 1, sec);
                    cache.set(key, 2, sec);
                    var cached = cache.get(key);
                    expect(cached).toBeDefined();
                    expect(cached).not.toBeNull();
                    expect(cached).not.toBe(1);
                    expect(cached).toBe(2);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
