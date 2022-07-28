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
                template: `
<a href="javascript:void(0);" class="picklist-toggle" ng-click="load()">+
    <md-tooltip md-direction="right" class="picklist">
        <span ng-if="!options">Click to load options</span>
        <span ng-if="options && !options.length">Loading...</span>
        <ul class="options" ng-if="options && options.length">
            <li class="option" ng-repeat="option in options">
                <span ng-bind="option.Label.UserLocalizedLabel.Label"></span>
                <span ng-if="option.Value !== null">&nbsp;=&nbsp;</span>
                <span ng-bind="option.Value"></span>
            </li>
        </ul>
    </md-tooltip>
</a>`
            };
        }
        class PicklistController {
            constructor(scope, dataService) {
                scope.load = () => {
                    if (scope.options) {
                        return;
                    }
                    scope.options = [];
                    dataService
                        .GetOptionSets(scope.entity, scope.attribute)
                        .then((optionSets) => {
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
                        .catch(() => {
                        scope.options = null;
                    });
                };
            }
        }
        PicklistController.$inject = ["$scope", "metadataBrowser.core.dataService"];
        angular.module(MetadataBrower.Config.moduleName)
            .directive("picklist", picklistFactory);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
