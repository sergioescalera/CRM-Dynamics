var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var EntityListController = (function () {
            function EntityListController($scope, navigationService, dataService) {
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
            EntityListController.prototype.clear = function () {
                this.currentPage = 1;
                this.filter = "";
                this.showEntities();
            };
            EntityListController.prototype.exportToCsv = function () {
                console.warn("Not implemented");
            };
            EntityListController.prototype.filterEntities = function () {
                var filter = this.filter;
                var entities = this.entities.filter(function (e) {
                    return e.LogicalName.indexOf(filter) >= 0;
                });
                this.showEntities(entities);
            };
            EntityListController.prototype.loadEntities = function () {
                var _this = this;
                this.currentPage = 1;
                this.entities = [];
                this.entitiesToShow = [];
                this.filter = "";
                this.total = 0;
                this.isBusy = true;
                this.dataService.GetEntities()
                    .then((function (data) {
                    _this.entities = data.sort(function (e1, e2) {
                        if (e1.SchemaName < e2.SchemaName) {
                            return -1;
                        }
                        if (e1.SchemaName > e2.SchemaName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showEntities();
                })
                    .bind(this))
                    .finally(this.loadEntitiesCompleted.bind(this));
            };
            EntityListController.prototype.loadEntitiesCompleted = function () {
                this.isBusy = false;
            };
            EntityListController.prototype.showEntities = function (entities) {
                entities = entities || this.entities;
                var pageSize = this.pageSize;
                var skip = (this.currentPage - 1) * pageSize;
                this.total = entities.length;
                this.entitiesToShow = entities
                    .filter(function (e, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityListController.prototype.openEntity = function (entity) {
                this.navigationService.AddEntityTab(entity);
            };
            EntityListController.prototype.search = function () {
                this.currentPage = 1;
                this.filterEntities();
            };
            EntityListController.$inject = ["$scope", "metadataBrowser.core.navigationService", "metadataBrowser.core.dataService"];
            return EntityListController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
