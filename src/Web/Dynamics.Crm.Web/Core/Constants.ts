module Dynamics.Crm {

    export var publisherPrefix = "ts4_"
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