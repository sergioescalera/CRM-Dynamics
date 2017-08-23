module Dynamics.Crm {

    "use strict";

    export var componentName = (prefix: string, name: string) => `${prefix}_${name}`;
}

module Dynamics.Crm.Publishers {

    "use strict";

    export var bootstrap: string = "cc";
    export var logEntry: string = "cc";
}

module Dynamics.Crm.Forms {

    "use strict";

    export class FormNotificationType {

        public static Error: string = "ERROR";
        public static Warning: string = "WARNING";
        public static Information: string = "INFO";
    }

    export class ClientType {

        public static Browser: string = "Web";
        public static Outlook: string = "Outlook";
        public static Mobile: string = "Mobile";
    }

    export class AttributeRequiredLevel {

        public static None: string = "none";
        public static Required: string = "required";
        public static Recommended: string = "recommended";
    }
}