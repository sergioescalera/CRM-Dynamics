var Caching;
(function (Caching) {
    "use strict";
    var CacheService = (function () {
        function CacheService(storage) {
            if (storage === void 0) { storage = localStorage; }
            Validation.ensureNotNullOrUndefined(storage, "storage");
            this._storage = storage;
        }
        CacheService.prototype.clear = function () {
            this._storage.clear();
        };
        CacheService.prototype.get = function (key, factory, expiration) {
            if (factory === void 0) { factory = null; }
            if (expiration === void 0) { expiration = 5 * 60; }
            Validation.ensureNotNullOrEmpty(key, "key");
            var str = this._storage.getItem(key);
            var entry;
            if (str) {
                entry = this.parse(str);
            }
            var now = new Date();
            if (entry && moment(entry.expiration).local().toDate() >= now) {
                return entry.value;
            }
            if (!_.isFunction(factory)) {
                return null;
            }
            var value = factory();
            this.set(key, value, expiration);
            return value;
        };
        CacheService.prototype.set = function (key, value, expiration) {
            if (expiration === void 0) { expiration = 5 * 60; }
            Validation.ensureNotNullOrEmpty(key, "key");
            Validation.ensureNumberInRange(expiration, 0);
            var entry = {
                expiration: moment()
                    .add({
                    seconds: expiration
                })
                    .utc()
                    .toDate(),
                value: value
            };
            var json = JSON.stringify(entry);
            this._storage.setItem(key, json);
        };
        CacheService.prototype.parse = function (str) {
            try {
                return JSON.parse(str);
            }
            catch (e) {
                console.warn(e);
                return null;
            }
        };
        return CacheService;
    }());
    Caching.CacheService = CacheService;
    Caching.cache = new CacheService();
})(Caching || (Caching = {}));
