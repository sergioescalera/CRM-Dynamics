var Validation;
(function (Validation) {
    "use strict";
    function ensureNotNullOrUndefined(value, label) {
        if (value === undefined || value === null) {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }
    }
    Validation.ensureNotNullOrUndefined = ensureNotNullOrUndefined;
    function ensureNotNullOrEmpty(str, label) {
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
    Validation.ensureNotNullOrEmpty = ensureNotNullOrEmpty;
    function ensureNumberInRange(value, min, max, paramName) {
        if (min === void 0) { min = null; }
        if (max === void 0) { max = null; }
        if (paramName === void 0) { paramName = null; }
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
    Validation.ensureNumberInRange = ensureNumberInRange;
})(Validation || (Validation = {}));
var Validation;
(function (Validation) {
    var Strings;
    (function (Strings) {
        "use strict";
        function left(str, length) {
            Validation.ensureNumberInRange(length, 0);
            if (str === null || str === undefined)
                return str;
            if (str.length <= length)
                return str;
            return str.substr(0, length);
        }
        Strings.left = left;
        function right(str, length) {
            Validation.ensureNumberInRange(length, 0);
            if (str === null || str === undefined)
                return str;
            if (str.length <= length)
                return str;
            return str.substr(str.length - length, length);
        }
        Strings.right = right;
    })(Strings = Validation.Strings || (Validation.Strings = {}));
})(Validation || (Validation = {}));
//# sourceMappingURL=Validation.js.map