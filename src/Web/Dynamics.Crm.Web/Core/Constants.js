var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        Crm.componentName = function (prefix, name) { return prefix + "_" + name; };
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Publishers;
        (function (Publishers) {
            "use strict";
            Publishers.logEntry = "cc";
        })(Publishers = Crm.Publishers || (Crm.Publishers = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        var FormNotificationTypes = /** @class */ (function () {
            function FormNotificationTypes() {
            }
            FormNotificationTypes.Error = "ERROR";
            FormNotificationTypes.Warning = "WARNING";
            FormNotificationTypes.Information = "INFO";
            return FormNotificationTypes;
        }());
        Crm.FormNotificationTypes = FormNotificationTypes;
        var ClientType = /** @class */ (function () {
            function ClientType() {
            }
            ClientType.Browser = "Web";
            ClientType.Outlook = "Outlook";
            ClientType.Mobile = "Mobile";
            return ClientType;
        }());
        Crm.ClientType = ClientType;
        var AttributeRequiredLevels = /** @class */ (function () {
            function AttributeRequiredLevels() {
            }
            AttributeRequiredLevels.None = "none";
            AttributeRequiredLevels.Required = "required";
            AttributeRequiredLevels.Recommended = "recommended";
            return AttributeRequiredLevels;
        }());
        Crm.AttributeRequiredLevels = AttributeRequiredLevels;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
