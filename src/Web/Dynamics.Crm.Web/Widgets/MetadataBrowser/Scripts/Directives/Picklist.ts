module MetadataBrower.Controllers {

    "use strict";

    function picklistFactory(): ng.IDirective {

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
                <span>&nbsp;=&nbsp;</span>
                <span ng-bind="option.Value"></span>
            </li>
        </ul>
    </md-tooltip>
</a>`
        };
    }

    interface IPicklistScope extends ng.IScope {
        attribute: IEntityDefinition;
        entity: IAttributeDefinition;
        load(): void;
        options: IOptionSetValueDefinition[];
    }

    class PicklistController {

        static $inject = ["$scope", "metadataBrowser.core.dataService"];

        constructor(scope: IPicklistScope, dataService: Core.IDataService) {

            scope.load = () => {
                
                if (scope.options) {
                    return;
                }

                scope.options = [];

                dataService
                    .GetOptionSets(scope.entity, scope.attribute)
                    .then((optionSets: IOptionSetValueDefinition[]) => {
                        scope.options = optionSets;
                    })
                    .catch(() => {
                        debugger;
                        scope.options = null;
                    });
            }
        }
    }

    angular.module(Config.moduleName)
        .directive("picklist", picklistFactory);
}