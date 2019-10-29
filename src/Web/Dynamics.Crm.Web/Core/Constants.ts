module Dynamics.Crm {

    "use strict";

    export var componentName = (prefix: string, name: string) => `${prefix}_${name}`;
}

module Dynamics.Crm.Publishers {

    "use strict";

    export var bootstrap: string = "cc";
    export var logEntry: string = "cc";
}

module Dynamics.Crm {

    "use strict";

    export class FormNotificationTypes {

        public static Error: "ERROR" = "ERROR";
        public static Warning: "WARNING" = "WARNING";
        public static Information: "INFO" = "INFO";
    }

    export class ClientType {

        public static Browser: "Web" = "Web";
        public static Outlook: "Outlook" = "Outlook";
        public static Mobile: "Mobile" = "Mobile";
    }

    export class AttributeRequiredLevels {

        public static None: "none" = "none";
        public static Required: "required" = "required";
        public static Recommended: "recommended" = "recommended";
    }
}