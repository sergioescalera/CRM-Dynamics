var RecordCounter;
(function (RecordCounter) {
    var Config;
    (function (Config) {
        "use strict";
        window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
            "entitydefinition": "EntityDefinitions"
        });
        Config.moduleName = "record-counter";
        function init() {
            angular.bootstrap(document, [
                Config.moduleName
            ]);
        }
        angular.module(Config.moduleName, [
            "ngMaterial",
            "ngMessages",
            MetadataBrower.Core.dataService,
            MetadataBrower.Controllers.pager
        ]);
        angular.element(document)
            .ready(init);
    })(Config = RecordCounter.Config || (RecordCounter.Config = {}));
})(RecordCounter || (RecordCounter = {}));
