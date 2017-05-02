module MetadataBrower.Controllers {

    "use strict";

    function propertyBrowser(): ng.IDirective {

        return {
            restrict: "A",
            scope: {
                object: "="
            },
            templateUrl: "templates/property_browser.html"
        };
    }

    angular.module(Config.moduleName)
        .directive("propertyBrowser", propertyBrowser);
}