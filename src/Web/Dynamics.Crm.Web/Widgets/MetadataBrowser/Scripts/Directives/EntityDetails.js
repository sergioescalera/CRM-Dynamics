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
        class EntityDetails {
            constructor(scope, dataService) {
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
                //            scope.export = this.export.bind(this);
                this.vm = scope.vm;
                this.loadEntityMetadata();
                scope.$watch("vm.currentPage", this.filterAttributes.bind(this));
            }
            clear() {
                this.vm.currentPage = 1;
                this.vm.filter = "";
                this.showAttributes();
            }
            //export(): void {
            //    console.warn("Not implemented");
            //}
            filterAttributes() {
                var filter = this.vm.filter;
                var attributes = this.vm.entityAttributes.filter((att) => {
                    return att.LogicalName.indexOf(filter) >= 0;
                });
                this.showAttributes(attributes);
            }
            loadEntityMetadata() {
                this.vm.isBusy = true;
                return this._dataService
                    .GetAttributes(this.vm.entity)
                    .then((array) => {
                    this.vm.entityAttributes = array.sort((a1, a2) => {
                        if (a1.LogicalName < a2.LogicalName) {
                            return -1;
                        }
                        if (a1.LogicalName > a2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });
                    this.showAttributes();
                    return this.vm.entityAttributes;
                })
                    .finally(this.loadEntityMetadataCompleted.bind(this));
            }
            loadEntityMetadataCompleted() {
                this.vm.isBusy = false;
            }
            search() {
                this.vm.currentPage = 1;
                this.filterAttributes();
            }
            showAttributes(attributes) {
                attributes = attributes || this.vm.entityAttributes;
                var pageSize = this.vm.pageSize;
                var skip = (this.vm.currentPage - 1) * pageSize;
                this.vm.total = attributes.length;
                this.vm.attributes = attributes
                    .filter((a, index) => index >= skip && index < skip + pageSize);
            }
        }
        EntityDetails.$inject = ["$scope", "metadataBrowser.core.dataService"];
        angular.module(MetadataBrower.Config.moduleName)
            .directive("entityDetails", entityDetailsFactory);
    })(Controller = MetadataBrower.Controller || (MetadataBrower.Controller = {}));
})(MetadataBrower || (MetadataBrower = {}));
