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

        filterAttributes(): void {

            var filter: string = this.vm.filter;

            var attributes: Core.IAttribute[] = this.vm.entityAttributes.filter((att: Core.IAttribute) => {

                return att.LogicalName.indexOf(filter) >= 0;
            });

            this.showAttributes(attributes);
        }

        loadEntityMetadata(): ng.IPromise<IAttributeDefinition[]> {

            this.vm.isBusy = true;

            return this._dataService.GetAttributes(this.vm.entity)
                .then(((array: IAttributeDefinition[]) => {

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
                }).bind(this))
                .finally(this.loadEntityMetadataCompleted.bind(this));
        }

        loadEntityMetadataCompleted(): void {

            this.vm.isBusy = false;
        }

        search(): void {

            this.vm.currentPage = 1;
            this.filterAttributes();
        }

        showAttributes(attributes?: Core.IAttribute[]): void {

            attributes = attributes || this.vm.entityAttributes;

            var pageSize: number = this.vm.pageSize;
            var skip: number = (this.vm.currentPage - 1) * pageSize;

            this.vm.total = attributes.length;
            this.vm.attributes = attributes.filter(
                (a: Core.IAttribute, index: number) => index >= skip && index < skip + pageSize);
        }
    }

    angular.module(Config.moduleName)
        .directive("entityDetails", entityDetailsFactory);
}