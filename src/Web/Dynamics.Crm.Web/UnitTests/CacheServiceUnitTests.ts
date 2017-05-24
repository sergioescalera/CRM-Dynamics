module Dynamics.Crm.UnitTests {

    "use strict";

    describe("CacheService.get", () => {

        it("Throws error for null key", () => {

            var cache = new Caching.CacheService();

            expect(() => cache.get(null)).toThrowError(Error);
        });

        it("Throws error for undefined key", () => {

            var cache = new Caching.CacheService();

            expect(() => cache.get(undefined)).toThrowError(Error);
        });

        it("Returns null for missing key", () => {

            var cache = new Caching.CacheService();

            var key = "key";
            var cached = cache.get(key);

            expect(cached).toBeDefined();
            expect(cached).toBeNull();
        });
    });

    describe("CacheService.set", () => {

        it("Throws error for null key", () => {

            var cache = new Caching.CacheService();

            expect(() => cache.set(null, {})).toThrowError(Error);
        });

        it("Throws error for undefined key", () => {

            var cache = new Caching.CacheService();

            expect(() => cache.set(undefined, {})).toThrowError(Error);
        });
    });

    describe("CacheService.get/CacheService.set", () => {
        
        it("Returns null if expired", (done) => {
            
            var cache = new Caching.CacheService();

            var key = "key";
            var value = { name: "This is a test object" };
            var sec = 1;

            cache.set(key, value, sec);
            
            setTimeout(() => {
                
                var cached = cache.get(key);

                expect(cached).toBeDefined();
                expect(cached).toBeNull();

                done();

            }, 1500);
        });

        it("Returns new item if expired when a factory function is provided", (done) => {

            var cache = new Caching.CacheService();

            var key = "key";
            var counter = 0;
            var factory = () => { return { n: ++counter }; };
            var value = factory();
            var sec = 1;

            cache.set(key, value, sec);

            setTimeout(() => {

                var cached = cache.get(key, factory);

                expect(cached).toBeDefined();
                expect(cached).not.toBeNull();
                expect(cached.n).not.toBe(value.n);
                expect(cached.n).toBe(counter);
                done();

            }, 1500);
        });

        it("Returns cached item", (done) => {

            var cache = new Caching.CacheService();

            var key = "key";
            var value = { name: "This is a test object" };
            var sec = 1;

            cache.set(key, value, sec);

            setTimeout(() => {
                
                var cached = cache.get<any>(key);

                expect(cached).toBeDefined();
                expect(cached).not.toBeNull();
                expect(cached.name).toBeDefined();
                expect(cached.name).not.toBeNull();
                expect(cached.name).toBe(value.name);

                done();

            }, 500);
        });
    });
}