var Resources;
(function (Resources) {
    "use strict";
    var nullArgumentMessageFormat = "Argument cannot be null or undefined '{paramName}'.";
    var nullOrEmptyArgumentMessageFormat = "Argument cannot be null or empty string '{paramName}'.";
    var invalidTypeMessageFormat = "Invalid argument type '{actualType}' expecting type '{expectedType}'.";
    var outOfRangeMessageFormat = "Argument '{paramName}' was out of the range of valid values.";
    var Strings = (function () {
        function Strings() {
        }
        Strings.NullArgumentMessageFormat = function (paramName) { return nullArgumentMessageFormat
            .replace("{paramName}", paramName || ""); };
        Strings.NullOrEmptyArgumentMessageFormat = function (paramName) { return nullOrEmptyArgumentMessageFormat
            .replace("{paramName}", paramName || ""); };
        Strings.InvalidTypeMessageFormat = function (expectedType, actualType) { return invalidTypeMessageFormat
            .replace("{expectedType}", expectedType || "")
            .replace("{actualType}", actualType || ""); };
        Strings.OutOfRangeMessageFormat = function (paramName) { return outOfRangeMessageFormat
            .replace("{paramName}", paramName || ""); };
        Strings.NotSupportedMessage = "Not supported.";
        Strings.No = "No";
        Strings.Yes = "Yes";
        return Strings;
    }());
    Resources.Strings = Strings;
})(Resources || (Resources = {}));
