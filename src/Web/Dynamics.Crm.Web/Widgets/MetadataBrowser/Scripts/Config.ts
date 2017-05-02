module MetadataBrower.Config {

    "use strict";

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