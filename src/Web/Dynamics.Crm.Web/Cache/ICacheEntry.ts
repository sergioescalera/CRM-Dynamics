module Caching {

    "use strict";

    export interface ICacheEntry<T> {
        expiration?: Date;
        value?: T;
    }
}