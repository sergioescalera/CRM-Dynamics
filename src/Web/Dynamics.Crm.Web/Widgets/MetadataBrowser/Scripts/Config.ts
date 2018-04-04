module MetadataBrower.Config {

    "use strict";

    window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
        "entitydefinition": "EntityDefinitions"
    });

    export var moduleName = "metadata-browser";

    function init() {
        angular.bootstrap(document, [
            moduleName
        ]);
    }

    angular.module(moduleName, [
        "ngMaterial",
        "ngMessages"
    ]);

    angular.element(document)
        .ready(init);
}