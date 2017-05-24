module Caching {

    "use strict";

    export interface ICacheService {

        clear(): void;
        get<T>(key: string, factory?: () => T, expiration?: number): T;
        set<T>(key: string, value: T, expiration: number): void;
    }
}