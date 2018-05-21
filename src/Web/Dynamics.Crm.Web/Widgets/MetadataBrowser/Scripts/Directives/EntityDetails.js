var MetadataBrower;
(function (MetadataBrower) {
    var Controller;
    (function (Controller) {
        "use strict";
        function entityDetailsFactory() {
            return {
                controller: EntityDetails,
                restrict: "E",
                scope: {
                    entity: "="
                },
                templateUrl: "templates/entity_details.html"
            };
        }
        var EntityDetails = /** @class */ (function () {
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
                return this._dataService
                    .GetAttributes(this.vm.entity)
                    .then(function (array) {
                    _this.vm.entityAttributes = array.sort(function (a1, a2) {
                        if (a1.LogicalName < a2.LogicalName) {
                            return -1;
                        }
                        if (a1.LogicalName > a2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showAttributes();
                    return _this.vm.entityAttributes;
                })
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
                this.vm.attributes = attributes
                    .filter(function (a, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityDetails.$inject = ["$scope", "metadataBrowser.core.dataService"];
            return EntityDetails;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("entityDetails", entityDetailsFactory);
    })(Controller = MetadataBrower.Controller || (MetadataBrower.Controller = {}));
})(MetadataBrower || (MetadataBrower = {}));
