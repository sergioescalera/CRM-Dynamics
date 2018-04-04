var MetadataBrower;
(function (MetadataBrower) {
    var Config;
    (function (Config) {
        "use strict";
        window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
            "entitydefinition": "EntityDefinitions"
        });
        Config.moduleName = "metadata-browser";
        function init() {
            angular.bootstrap(document, [
                Config.moduleName
            ]);
        }
        angular.module(Config.moduleName, [
            "ngMaterial",
            "ngMessages"
        ]);
        angular.element(document)
            .ready(init);
    })(Config = MetadataBrower.Config || (MetadataBrower.Config = {}));
})(MetadataBrower || (MetadataBrower = {}));
