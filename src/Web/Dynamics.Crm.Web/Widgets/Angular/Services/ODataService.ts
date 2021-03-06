﻿module Angular.Core {

    "use strict";

    class ODataService implements IDataService {

        private _$q: ng.IQService;

        constructor($q: ng.IQService) {

            this._$q = $q;
        }

        GetEntities(): ng.IPromise<IEntityDefinition[]> {

            const defer: ng.IDeferred<IEntityDefinition[]> = this._$q.defer<IEntityDefinition[]>();
            
            Dynamics.Crm.OData
                .entityDefinitions()
                .then((array: IEntityDefinition[]) => {

                    defer.resolve(array);
                })
                .catch((error) => {
                    defer.reject(error);
                });

            return defer.promise;
        }

        GetAttributes(entityDefinition: IEntityDefinition): ng.IPromise<IAttributeDefinition[]> {

            const defer: ng.IDeferred<IAttributeDefinition[]> = this._$q.defer<IAttributeDefinition[]>();

            Dynamics.Crm.OData
                .entityAttributesDefinition(entityDefinition.MetadataId)
                .then((array: IAttributeDefinition[]) => {

                    defer.resolve(array);
                })
                .catch((error) => {
                    defer.reject(error);
                });

            return defer.promise;
        }

        GetOptionSets(
            entityDefinition: IEntityDefinition,
            attributeDefinition: IAttributeDefinition): ng.IPromise<IOptionSetValueDefinition[]> {

            const defer: ng.IDeferred<IOptionSetValueDefinition[]> = this._$q.defer<IOptionSetValueDefinition[]>();

            Dynamics.Crm.OData
                .entityAttributeOptionSetDefinition(
                    entityDefinition.MetadataId,
                    attributeDefinition.MetadataId)
                .then((array: IAttributeDefinition[]) => {

                    defer.resolve(array);
                })
                .catch((error) => {
                    defer.reject(error);
                });

            return defer.promise;
        }
    }

    function DataServiceFactory($q: ng.IQService): IDataService {

        return new ODataService($q);
    }

    export var dataService: string = "data-service";

    angular.module(dataService, [])
        .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
}