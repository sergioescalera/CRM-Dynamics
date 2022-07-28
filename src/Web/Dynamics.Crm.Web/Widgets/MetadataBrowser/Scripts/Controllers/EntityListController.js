var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        class EntityListController {
            constructor($scope, navigationService, dataService) {
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
            clear() {
                this.currentPage = 1;
                this.filter = "";
                this.showEntities("");
            }
            exportToCsv() {
                console.warn("Not implemented");
            }
            loadEntities() {
                this.currentPage = 1;
                this.entities = [];
                this.entitiesToShow = [];
                this.filter = "";
                this.total = 0;
                this.isBusy = true;
                this.dataService
                    .GetEntities()
                    .then((data) => {
                    this.entities = data.sort((e1, e2) => {
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
            loadEntitiesCompleted() {
                this.isBusy = false;
            }
            showEntities(filter) {
                const entities = this.entities || [];
                const pageSize = this.pageSize;
                const skip = (this.currentPage - 1) * pageSize;
                const filtered = this.entities.filter((e) => {
                    return e.LogicalName.indexOf(filter) >= 0;
                });
                this.total = entities.length;
                this.entitiesToShow = filtered
                    .filter((e, index) => index >= skip && index < skip + pageSize);
            }
            openEntity(entity) {
                this.navigationService.AddEntityTab(entity);
            }
            search() {
                this.currentPage = 1;
                const filter = this.filter;
                const entities = this.entities || [];
                if (entities.length) {
                    this.showEntities(filter);
                }
                else {
                    this.loadEntities();
                }
            }
        }
        EntityListController.$inject = ["$scope", "metadataBrowser.core.navigationService", "metadataBrowser.core.dataService"];
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
