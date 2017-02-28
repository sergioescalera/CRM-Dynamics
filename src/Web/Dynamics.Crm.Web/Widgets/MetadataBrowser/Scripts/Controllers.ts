module MetadataBrower.Controllers {

    "use strict";

    class MetadataBrowserController {

        static $inject = ["metadataBrowser.core.navigationService"];

        navigationService: Core.INavigationService;

        constructor(navigationService: Core.INavigationService) {

            var vm = this;

            vm.navigationService = navigationService;
        }
    }

    angular.module(Config.moduleName)
        .controller("metadataBrowser.ui.controllers.crmMetadataBrowser", MetadataBrowserController);
}

module MetadataBrower.Controllers {

    "use strict";

    class EntityListController {

        advancedView: boolean;
        currentPage: number;
        entities: IEntityDefinition[];
        entitiesToShow: IEntityDefinition[];
        filter: string;
        isBusy: boolean;
        pageSize: number;
        total: number;

        navigationService: Core.INavigationService;
        dataService: Core.IDataService;

        static $inject = ["$scope", "metadataBrowser.core.navigationService", "metadataBrowser.core.dataService"];

        constructor($scope: ng.IScope, navigationService: Core.INavigationService, dataService: Core.IDataService) {

            this.advancedView = false;
            this.currentPage = 1;
            this.entities = [];
            this.entitiesToShow = [];
            this.filter = "";
            this.isBusy = false;
            this.pageSize = 20;
            this.total = 0;

            this.navigationService = navigationService;
            this.dataService = dataService;

            $scope.$watch("vm.currentPage", this.filterEntities.bind(this));

            this.loadEntities();
        }

        clear(): void {

            this.currentPage = 1;
            this.filter = "";

            this.showEntities();
        }

        exportToCsv(): void {

            console.warn("Not implemented");
        }

        filterEntities(): void {

            var filter = this.filter;

            var entities = this.entities.filter((e: IEntityDefinition) => {

                return e.LogicalName.indexOf(filter) >= 0;
            });

            this.showEntities(entities);
        }

        loadEntities(): void {

            this.currentPage = 1;
            this.entities = [];
            this.entitiesToShow = [];
            this.filter = "";
            this.total = 0;
            this.isBusy = true;

            this.dataService.GetEntities()
                .then(((data: IEntityDefinition[]) => {

                    this.entities = data.sort((e1: IEntityDefinition, e2: IEntityDefinition) => {
                        if (e1.SchemaName < e2.SchemaName) {
                            return -1;
                        }
                        if (e1.SchemaName > e2.SchemaName) {
                            return 1;
                        }
                        return 0;
                    });

                    this.showEntities();

                })
                .bind(this))
                .finally(this.loadEntitiesCompleted.bind(this));
        }

        loadEntitiesCompleted() {

            this.isBusy = false;
        }

        showEntities(entities?: any[]) {

            entities = entities || this.entities;

            var pageSize = this.pageSize;
            var skip = (this.currentPage - 1) * pageSize;

            this.total = entities.length;
            this.entitiesToShow = entities
                .filter((e: IEntityDefinition, index: number) => index >= skip && index < skip + pageSize);
        }

        openEntity(entity: IEntityDefinition) {

            this.navigationService.AddEntityTab(entity);
        }

        search() {

            this.currentPage = 1;

            this.filterEntities();
        }
    }

    angular.module(Config.moduleName)
        .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
}

module MetadataBrower.Controller {

    "use strict";

    function entityDetailsFactory(): ng.IDirective {

        return {
            controller: EntityDetails,
            restrict: "A",
            scope: {
                entity: "="
            },
            templateUrl: "templates/entity_details.html"
        };
    }

    interface IEntityDetailsViewModel {
        advancedView: boolean;
        attributes: any[];
        currentPage: number;
        entity: IEntityDefinition;
        entityAttributes: IAttributeDefinition[];
        isBusy: boolean;
        filter: string;
        pageSize: number;
        total: number;
    }

    interface IEntityDetailsScope extends ng.IScope {
        clear(): void;
        search(): void;
        export(): void;
        entity: IEntityDefinition;
        vm: IEntityDetailsViewModel;
    }

    class EntityDetails {

        static $inject = ["$scope", "metadataBrowser.core.dataService"];

        _entityId: Core.INavigationTab;
        _dataService: Core.IDataService;

        vm: IEntityDetailsViewModel;

        constructor(scope: IEntityDetailsScope, dataService: Core.IDataService) {
            
            this._dataService = dataService;

            scope.vm = {
                advancedView: false,
                attributes: [],
                currentPage: 1,
                entity: scope.entity,
                entityAttributes: [],
                isBusy: false,
                filter: "",
                pageSize: 20,
                total: 0
            };
            scope.clear = this.clear.bind(this);
            scope.search = this.search.bind(this);
            scope.export = this.export.bind(this);

            this.vm = scope.vm;
            this.loadEntityMetadata();

            scope.$watch("vm.currentPage", this.filterAttributes.bind(this));
        }

        clear(): void {

            this.vm.currentPage = 1;
            this.vm.filter = "";

            this.showAttributes();
        }

        export(): void {

            console.warn("Not implemented");
        }

        filterAttributes() {

            var filter = this.vm.filter;

            var attributes = this.vm.entityAttributes.filter((att: Core.IAttribute) => {

                return att.LogicalName.indexOf(filter) >= 0;
            });

            this.showAttributes(attributes);
        }

        loadEntityMetadata() {

            this.vm.isBusy = true;

            debugger;

            return this._dataService.GetAttributes(this.vm.entity)
                .then(((array: IAttributeDefinition[]) => {

                    debugger;

                    this.vm.entityAttributes = array.sort((a1: Core.IAttribute, a2: Core.IAttribute) => {
                        if (a1.SchemaName < a2.SchemaName) {
                            return -1;
                        }
                        if (a1.SchemaName > a2.SchemaName) {
                            return 1;
                        }
                        return 0;
                    });

                    this.showAttributes();
                })
                .bind(this))
                .finally(this.loadEntityMetadataCompleted.bind(this));
        }

        loadEntityMetadataCompleted() {

            this.vm.isBusy = false;
        }

        search(): void {

            this.vm.currentPage = 1;
            this.filterAttributes();
        }

        showAttributes(attributes?: Core.IAttribute[]) {

            attributes = attributes || this.vm.entityAttributes;

            var pageSize = this.vm.pageSize;
            var skip = (this.vm.currentPage - 1) * pageSize;

            this.vm.total = attributes.length;
            this.vm.attributes = attributes.filter(
                (a: Core.IAttribute, index: number) => index >= skip && index < skip + pageSize);
        }
    }

    angular.module(Config.moduleName)
        .directive("tsEntityDetails", entityDetailsFactory);
}

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
        .directive("tsPropertyBrowser", propertyBrowser);
}