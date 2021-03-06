﻿module Caching {

    "use strict";

    export class CacheService implements ICacheService {

        _storage: Storage;

        constructor(storage: Storage = localStorage) {

            Validation.ensureNotNullOrUndefined(storage, "storage");

            this._storage = storage;
        }

        clear(): void {

            this._storage.clear();
        }

        get<T>(
            key: string,
            factory: () => T = null,
            expiration: number = 5 * 60): T {

            Validation.ensureNotNullOrEmpty(key, "key");

            let str = this._storage.getItem(key);

            let entry: ICacheEntry<T>;

            if (str) {
                entry = this.parse<T>(str);
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

        set<T>(
            key: string,
            value: T,
            expiration: number = 5 * 60): void {

            Validation.ensureNotNullOrEmpty(key, "key");
            Validation.ensureNumberInRange(expiration, 0);

            let entry: ICacheEntry<T> = {
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

        private parse<T>(str: string): ICacheEntry<T> {

            try {
                return JSON.parse(str);
            } catch (e) {
                console.warn(e);
                return null;
            }
        }
    }

    export var cache: ICacheService = new CacheService();
}