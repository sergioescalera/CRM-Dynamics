﻿module RecordCounter.Config {

    "use strict";

    window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
        "entitydefinition": "EntityDefinitions"
    });

    export var moduleName = "record-counter";

    function init() {
        angular.bootstrap(document, [
            moduleName
        ]);
    }

    angular.module(moduleName, [
        "ngMaterial",
        "ngMessages",
        MetadataBrower.Core.dataService,
        MetadataBrower.Controllers.pager
    ]);

    angular.element(document)
        .ready(init);
}