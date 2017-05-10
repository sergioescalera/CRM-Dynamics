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

            var filter: string = this.filter;

            var entities: IEntityDefinition[] = this.entities.filter((e: IEntityDefinition) => {

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

        loadEntitiesCompleted(): void {

            this.isBusy = false;
        }

        showEntities(entities?: any[]): void {

            entities = entities || this.entities;

            var pageSize: number = this.pageSize;
            var skip: number = (this.currentPage - 1) * pageSize;

            this.total = entities.length;
            this.entitiesToShow = entities
                .filter((e: IEntityDefinition, index: number) => index >= skip && index < skip + pageSize);
        }

        openEntity(entity: IEntityDefinition): void {

            this.navigationService.AddEntityTab(entity);
        }

        search(): void {

            this.currentPage = 1;

            this.filterEntities();
        }
    }

    angular.module(Config.moduleName)
        .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
}