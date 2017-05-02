module MetadataBrower.Core {

    "use strict";

    class ODataService implements IDataService {

        private _$q: ng.IQService;

        constructor($q: ng.IQService) {

            this._$q = $q;
        }

        GetEntities(): ng.IPromise<IEntityDefinition[]> {

            var defer: ng.IDeferred<IEntityDefinition[]> = this._$q.defer<IEntityDefinition[]>();

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

            var defer: ng.IDeferred<IEntityDefinition> = this._$q.defer<IEntityDefinition>();

            Dynamics.Crm.OData
                .entityAttributesDefinition(entityDefinition.MetadataId)
                .done((array: IAttributeDefinition[]) => {

                    defer.resolve(array);
                })
                .fail(() => {
                    defer.reject();
                });

            return defer.promise;
        }
    }

    function DataServiceFactory($q: ng.IQService): IDataService {

        return new ODataService($q);
    }

    angular.module(Config.moduleName)
        .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
}