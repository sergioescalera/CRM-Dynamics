var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            (function (FormType) {
                FormType[FormType["Undefined"] = 0] = "Undefined";
                FormType[FormType["Create"] = 1] = "Create";
                FormType[FormType["Update"] = 2] = "Update";
                FormType[FormType["ReadOnly"] = 3] = "ReadOnly";
                FormType[FormType["Disabled"] = 4] = "Disabled";
                FormType[FormType["QuickCreate"] = 5] = "QuickCreate";
                FormType[FormType["BulkEdit"] = 6] = "BulkEdit";
                FormType[FormType["ReadOptimized"] = 11] = "ReadOptimized";
            })(Forms.FormType || (Forms.FormType = {}));
            var FormType = Forms.FormType;
            (function (FormFactor) {
                FormFactor[FormFactor["Unknown"] = 0] = "Unknown";
                FormFactor[FormFactor["Desktop"] = 1] = "Desktop";
                FormFactor[FormFactor["Tablet"] = 2] = "Tablet";
                FormFactor[FormFactor["Phone"] = 3] = "Phone";
            })(Forms.FormFactor || (Forms.FormFactor = {}));
            var FormFactor = Forms.FormFactor;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
