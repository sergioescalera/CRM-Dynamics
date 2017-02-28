module MetadataBrower.Core {

    "use strict";

    export interface IAttribute {
        LogicalName?: string;
        SchemaName?: string;
    }
}

module MetadataBrower.Core {

    "use strict";

    export interface IDataService {
        GetEntities(): ng.IPromise<IEntityDefinition[]>;
        GetAttributes(entityDefinition: IEntityDefinition): ng.IPromise<IAttributeDefinition[]>;
    }

    class ODataService implements IDataService {

        private _$q: ng.IQService;

        constructor($q: ng.IQService) {

            this._$q = $q;
        }

        GetEntities(): ng.IPromise<IEntityDefinition[]> {

            var defer = this._$q.defer<IEntityDefinition[]>();

            Dynamics.Crm.OData
                .entityDefinitions()
                .done((array: IEntityDefinition[]) => {

                    defer.resolve(array);
                })
                .fail(() => {
                    defer.reject();
                });

            return defer.promise;
        }

        GetAttributes(entityDefinition: IEntityDefinition): ng.IPromise<IAttributeDefinition[]> {

            var defer = this._$q.defer<IEntityDefinition>();

            Dynamics.Crm.OData
                .entityAttributesDefinition(entityDefinition.MetadataId)
                .done((array: IAttributeDefinition[]) => {

                    debugger;

                    defer.resolve(array);
                })
                .fail(() => {
                    defer.reject();
                });

            return defer.promise;
        }
    }

    function DataServiceFactory($q: ng.IQService): IDataService {

        // return new DataService($q);
        return new ODataService($q);
    }

    angular.module(Config.moduleName)
        .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
}

module MetadataBrower.Core {

    "use strict";

    export interface INavigationService {
        AddEntityTab(entity: IEntityDefinition): void;
        DeleteEntityTab(tab: INavigationTab): void;
    }

    export interface INavigationTab {
        active: boolean;
        entity: IEntityDefinition;
        title: string;
    }

    class NavigationService implements INavigationService {

        EntityTabs = new Array<INavigationTab>();

        AddEntityTab(entity: IEntityDefinition): void {

            var filter = this.EntityTabs.filter((x: INavigationTab) => x.entity.LogicalName === entity.LogicalName);

            if (!!filter.length) {

                filter[0].active = true;

            } else {

                this.EntityTabs.push({
                    active: true,
                    entity: entity,
                    title: entity.SchemaName
                });
            }
        }

        DeleteEntityTab(tab: INavigationTab) {

            _.remove(this.EntityTabs, (t: INavigationTab) => t.entity.LogicalName === tab.entity.LogicalName);
        }
    }

    function NavigationServiceFactory(): INavigationService {

        return new NavigationService();
    }

    angular.module(Config.moduleName)
        .factory("metadataBrowser.core.navigationService", [NavigationServiceFactory]);
}