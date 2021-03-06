var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function picklistFactory() {
            return {
                controller: PicklistController,
                restrict: "E",
                scope: {
                    entity: "=",
                    attribute: "="
                },
                template: "\n<a href=\"javascript:void(0);\" class=\"picklist-toggle\" ng-click=\"load()\">+\n    <md-tooltip md-direction=\"right\" class=\"picklist\">\n        <span ng-if=\"!options\">Click to load options</span>\n        <span ng-if=\"options && !options.length\">Loading...</span>\n        <ul class=\"options\" ng-if=\"options && options.length\">\n            <li class=\"option\" ng-repeat=\"option in options\">\n                <span ng-bind=\"option.Label.UserLocalizedLabel.Label\"></span>\n                <span ng-if=\"option.Value !== null\">&nbsp;=&nbsp;</span>\n                <span ng-bind=\"option.Value\"></span>\n            </li>\n        </ul>\n    </md-tooltip>\n</a>"
            };
        }
        var PicklistController = /** @class */ (function () {
            function PicklistController(scope, dataService) {
                scope.load = function () {
                    if (scope.options) {
                        return;
                    }
                    scope.options = [];
                    dataService
                        .GetOptionSets(scope.entity, scope.attribute)
                        .then(function (optionSets) {
                        scope.options = optionSets;
                        if (!scope.options.length) {
                            scope.options.push({
                                Label: {
                                    UserLocalizedLabel: {
                                        Label: "No values"
                                    }
                                },
                                Value: null
                            });
                        }
                    })
                        .catch(function () {
                        scope.options = null;
                    });
                };
            }
            PicklistController.$inject = ["$scope", "metadataBrowser.core.dataService"];
            return PicklistController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("picklist", picklistFactory);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
