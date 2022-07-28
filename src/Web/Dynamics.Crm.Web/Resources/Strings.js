var Resources;
(function (Resources) {
    "use strict";
    var nullArgumentMessageFormat = "Argument cannot be null or undefined '{paramName}'.";
    var nullOrEmptyArgumentMessageFormat = "Argument cannot be null or empty string '{paramName}'.";
    var invalidTypeMessageFormat = "Invalid argument type '{actualType}' expecting type '{expectedType}'.";
    var outOfRangeMessageFormat = "Argument '{paramName}' was out of the range of valid values.";
    class Strings {
    }
    Strings.NullArgumentMessageFormat = (paramName) => nullArgumentMessageFormat
        .replace("{paramName}", paramName || "");
    Strings.NullOrEmptyArgumentMessageFormat = (paramName) => nullOrEmptyArgumentMessageFormat
        .replace("{paramName}", paramName || "");
    Strings.InvalidTypeMessageFormat = (expectedType, actualType) => invalidTypeMessageFormat
        .replace("{expectedType}", expectedType || "")
        .replace("{actualType}", actualType || "");
    Strings.OutOfRangeMessageFormat = (paramName) => outOfRangeMessageFormat
        .replace("{paramName}", paramName || "");
    Strings.NotSupportedMessage = "Not supported.";
    Strings.No = "No";
    Strings.Yes = "Yes";
    Resources.Strings = Strings;
})(Resources || (Resources = {}));
