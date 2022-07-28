var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        Crm.componentName = (prefix, name) => `${prefix}_${name}`;
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
        class FormNotificationTypes {
        }
        FormNotificationTypes.Error = "ERROR";
        FormNotificationTypes.Warning = "WARNING";
        FormNotificationTypes.Information = "INFO";
        Crm.FormNotificationTypes = FormNotificationTypes;
        class ClientType {
        }
        ClientType.Browser = "Web";
        ClientType.Outlook = "Outlook";
        ClientType.Mobile = "Mobile";
        Crm.ClientType = ClientType;
        class AttributeRequiredLevels {
        }
        AttributeRequiredLevels.None = "none";
        AttributeRequiredLevels.Required = "required";
        AttributeRequiredLevels.Recommended = "recommended";
        Crm.AttributeRequiredLevels = AttributeRequiredLevels;
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
