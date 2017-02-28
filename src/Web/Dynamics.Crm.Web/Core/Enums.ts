module Dynamics.Crm.Forms {

    "use strict";

    export enum FormType {
        Undefined = 0,
        Create = 1,
        Update = 2,
        ReadOnly = 3,
        Disabled = 4,
        QuickCreate = 5,
        BulkEdit = 6,
        ReadOptimized = 11
    }

    export enum FormFactor {
        Unknown = 0,
        Desktop = 1,
        Tablet = 2,
        Phone = 3
    }
}