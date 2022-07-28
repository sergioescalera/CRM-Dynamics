var Caching;
(function (Caching) {
    "use strict";
    class CacheService {
        constructor(storage = localStorage) {
            Validation.ensureNotNullOrUndefined(storage, "storage");
            this._storage = storage;
        }
        clear() {
            this._storage.clear();
        }
        get(key, factory = null, expiration = 5 * 60) {
            Validation.ensureNotNullOrEmpty(key, "key");
            let str = this._storage.getItem(key);
            let entry;
            if (str) {
                entry = this.parse(str);
            }
            let now = new Date();
            if (entry && moment(entry.expiration).local().toDate() >= now) {
                return entry.value;
            }
            if (!_.isFunction(factory)) {
                return null;
            }
            let value = factory();
            this.set(key, value, expiration);
            return value;
        }
        set(key, value, expiration = 5 * 60) {
            Validation.ensureNotNullOrEmpty(key, "key");
            Validation.ensureNumberInRange(expiration, 0);
            let entry = {
                expiration: moment()
                    .add({
                    seconds: expiration
                })
                    .utc()
                    .toDate(),
                value: value
            };
            let json = JSON.stringify(entry);
            this._storage.setItem(key, json);
        }
        parse(str) {
            try {
                return JSON.parse(str);
            }
            catch (e) {
                console.warn(e);
                return null;
            }
        }
    }
    Caching.CacheService = CacheService;
    Caching.cache = new CacheService();
})(Caching || (Caching = {}));
