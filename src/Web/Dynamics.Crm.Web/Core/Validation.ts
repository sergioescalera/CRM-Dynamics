module Validation {

    "use strict";

    export function ensureNotNullOrUndefined(value: any, label: string): void {

        if (value === undefined || value === null) {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }        
    }

    export function ensureNotNullOrEmpty(str: string, label: string): void {

        if (str === undefined || str === null) {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }
        
        if (!_.isString(str)) {
            throw new Error(Resources.Strings.InvalidTypeMessageFormat("string", typeof str));
        }

        if (str === "") {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }
    }

    export function ensureNumberInRange(value: number, min: number = null, max: number = null, paramName: string = null)
    {
        if (!_.isNumber(value)) {
            throw new Error(Resources.Strings.InvalidTypeMessageFormat("number", typeof value));
        }

        if (_.isNumber(min) && value < min) {
            throw new Error(Resources.Strings.OutOfRangeMessageFormat(paramName));
        }

        if (_.isNumber(max) && value > max) {
            throw new Error(Resources.Strings.OutOfRangeMessageFormat(paramName));
        }
    }
}

module Validation.Strings {

    "use strict";

    export function left(str: string, length: number) {

        Validation.ensureNumberInRange(length, 0);

        if (str === null || str === undefined)
            return str;

        if (str.length <= length)
            return str;

        return str.substr(0, length);
    }

    export function right(str: string, length: number) {

        Validation.ensureNumberInRange(length, 0);

        if (str === null || str === undefined)
            return str;

        if (str.length <= length)
            return str;

        return str.substr(str.length - length, length);
    }
}