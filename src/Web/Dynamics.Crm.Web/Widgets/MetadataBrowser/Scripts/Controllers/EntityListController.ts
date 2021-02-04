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
        dataService: Angular.Core.IDataService;

        static $inject = ["$scope", "metadataBrowser.core.navigationService", "metadataBrowser.core.dataService"];

        constructor(
            $scope: ng.IScope,
            navigationService: Core.INavigationService,
            dataService: Angular.Core.IDataService) {

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

            this.loadEntities();

            $scope.$watch("vm.currentPage", () => this.showEntities(this.filter));
        }

        clear(): void {

            this.currentPage = 1;
            this.filter = "";

            this.showEntities("");
        }

        exportToCsv(): void {

            console.warn("Not implemented");
        }

        loadEntities(): void {

            this.currentPage = 1;
            this.entities = [];
            this.entitiesToShow = [];
            this.filter = "";
            this.total = 0;
            this.isBusy = true;

            this.dataService
                .GetEntities()
                .then((data: IEntityDefinition[]) => {
                    
                    this.entities = data.sort((e1: IEntityDefinition, e2: IEntityDefinition) => {

                        if (e1.LogicalName < e2.LogicalName) {
                            return -1;
                        }
                        if (e1.LogicalName > e2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });

                    this.showEntities(this.filter);
                })
                .finally(this.loadEntitiesCompleted.bind(this));
        }

        loadEntitiesCompleted(): void {

            this.isBusy = false;
        }

        showEntities(filter: string): void {

            const entities = this.entities || [];

            const pageSize = this.pageSize;
            const skip = (this.currentPage - 1) * pageSize;

            const filtered = this.entities.filter((e: IEntityDefinition) => {

                return e.LogicalName.indexOf(filter) >= 0;
            });

            this.total = entities.length;
            this.entitiesToShow = filtered
                .filter((e: IEntityDefinition, index: number) => index >= skip && index < skip + pageSize);
        }

        openEntity(entity: IEntityDefinition): void {

            this.navigationService.AddEntityTab(entity);
        }

        search(): void {

            this.currentPage = 1;

            const filter = this.filter;
            const entities = this.entities || [];

            if (entities.length) {

                this.showEntities(filter);

            } else {

                this.loadEntities();
            }
        }
    }

    angular.module(Config.moduleName)
        .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
}