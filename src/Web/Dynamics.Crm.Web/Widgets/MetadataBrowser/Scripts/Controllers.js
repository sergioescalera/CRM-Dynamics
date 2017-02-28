var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MetadataBrowserController = (function () {
            function MetadataBrowserController(navigationService) {
                var vm = this;
                vm.navigationService = navigationService;
            }
            MetadataBrowserController.$inject = ["metadataBrowser.core.navigationService"];
            return MetadataBrowserController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.crmMetadataBrowser", MetadataBrowserController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
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
var MetadataBrower;
(function (MetadataBrower) {
    var Controller;
    (function (Controller) {
        "use strict";
        function entityDetailsFactory() {
            return {
                controller: EntityDetails,
                restrict: "A",
                scope: {
                    entity: "="
                },
                templateUrl: "templates/entity_details.html"
            };
        }
        var EntityDetails = (function () {
            function EntityDetails(scope, dataService) {
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
            EntityDetails.prototype.clear = function () {
                this.vm.currentPage = 1;
                this.vm.filter = "";
                this.showAttributes();
            };
            EntityDetails.prototype.export = function () {
                console.warn("Not implemented");
            };
            EntityDetails.prototype.filterAttributes = function () {
                var filter = this.vm.filter;
                var attributes = this.vm.entityAttributes.filter(function (att) {
                    return att.LogicalName.indexOf(filter) >= 0;
                });
                this.showAttributes(attributes);
            };
            EntityDetails.prototype.loadEntityMetadata = function () {
                var _this = this;
                this.vm.isBusy = true;
                debugger;
                return this._dataService.GetAttributes(this.vm.entity)
                    .then((function (array) {
                    debugger;
                    _this.vm.entityAttributes = array.sort(function (a1, a2) {
                        if (a1.SchemaName < a2.SchemaName) {
                            return -1;
                        }
                        if (a1.SchemaName > a2.SchemaName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showAttributes();
                })
                    .bind(this))
                    .finally(this.loadEntityMetadataCompleted.bind(this));
            };
            EntityDetails.prototype.loadEntityMetadataCompleted = function () {
                this.vm.isBusy = false;
            };
            EntityDetails.prototype.search = function () {
                this.vm.currentPage = 1;
                this.filterAttributes();
            };
            EntityDetails.prototype.showAttributes = function (attributes) {
                attributes = attributes || this.vm.entityAttributes;
                var pageSize = this.vm.pageSize;
                var skip = (this.vm.currentPage - 1) * pageSize;
                this.vm.total = attributes.length;
                this.vm.attributes = attributes.filter(function (a, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityDetails.$inject = ["$scope", "metadataBrowser.core.dataService"];
            return EntityDetails;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("tsEntityDetails", entityDetailsFactory);
    })(Controller = MetadataBrower.Controller || (MetadataBrower.Controller = {}));
})(MetadataBrower || (MetadataBrower = {}));
var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function propertyBrowser() {
            return {
                restrict: "A",
                scope: {
                    object: "="
                },
                templateUrl: "templates/property_browser.html"
            };
        }
        angular.module(MetadataBrower.Config.moduleName)
            .directive("tsPropertyBrowser", propertyBrowser);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
