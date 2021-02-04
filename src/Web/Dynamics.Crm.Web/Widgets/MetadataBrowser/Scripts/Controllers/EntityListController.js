var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var EntityListController = /** @class */ (function () {
            function EntityListController($scope, navigationService, dataService) {
                var _this = this;
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
                $scope.$watch("vm.currentPage", function () { return _this.showEntities(_this.filter); });
            }
            EntityListController.prototype.clear = function () {
                this.currentPage = 1;
                this.filter = "";
                this.showEntities("");
            };
            EntityListController.prototype.exportToCsv = function () {
                console.warn("Not implemented");
            };
            EntityListController.prototype.loadEntities = function () {
                var _this = this;
                this.currentPage = 1;
                this.entities = [];
                this.entitiesToShow = [];
                this.filter = "";
                this.total = 0;
                this.isBusy = true;
                this.dataService
                    .GetEntities()
                    .then(function (data) {
                    _this.entities = data.sort(function (e1, e2) {
                        if (e1.LogicalName < e2.LogicalName) {
                            return -1;
                        }
                        if (e1.LogicalName > e2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showEntities(_this.filter);
                })
                    .finally(this.loadEntitiesCompleted.bind(this));
            };
            EntityListController.prototype.loadEntitiesCompleted = function () {
                this.isBusy = false;
            };
            EntityListController.prototype.showEntities = function (filter) {
                var entities = this.entities || [];
                var pageSize = this.pageSize;
                var skip = (this.currentPage - 1) * pageSize;
                var filtered = this.entities.filter(function (e) {
                    return e.LogicalName.indexOf(filter) >= 0;
                });
                this.total = entities.length;
                this.entitiesToShow = filtered
                    .filter(function (e, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityListController.prototype.openEntity = function (entity) {
                this.navigationService.AddEntityTab(entity);
            };
            EntityListController.prototype.search = function () {
                this.currentPage = 1;
                var filter = this.filter;
                var entities = this.entities || [];
                if (entities.length) {
                    this.showEntities(filter);
                }
                else {
                    this.loadEntities();
                }
            };
            EntityListController.$inject = ["$scope", "metadataBrowser.core.navigationService", "metadataBrowser.core.dataService"];
            return EntityListController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
