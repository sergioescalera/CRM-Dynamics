module Resources {

    "use strict";

    var nullArgumentMessageFormat: string = "Argument cannot be null or undefined '{paramName}'.";
    var nullOrEmptyArgumentMessageFormat: string = "Argument cannot be null or empty string '{paramName}'.";
    var invalidTypeMessageFormat: string = "Invalid argument type '{actualType}' expecting type '{expectedType}'.";
    var outOfRangeMessageFormat: string = "Argument '{paramName}' was out of the range of valid values.";

    export class Strings {

        static NullArgumentMessageFormat = (paramName: string) => nullArgumentMessageFormat
            .replace("{paramName}", paramName || "");
        static NullOrEmptyArgumentMessageFormat = (paramName: string) => nullOrEmptyArgumentMessageFormat
            .replace("{paramName}", paramName || "");
        static InvalidTypeMessageFormat = (expectedType: string, actualType: string) => invalidTypeMessageFormat
            .replace("{expectedType}", expectedType || "")
            .replace("{actualType}", actualType || "");
        static OutOfRangeMessageFormat = (paramName: string) => outOfRangeMessageFormat
            .replace("{paramName}", paramName || "");
        static NotSupportedMessage = "Not supported.";
        static No = "No";
        static Yes = "Yes";
    }
}