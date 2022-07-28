var Angular;
(function (Angular) {
    var Core;
    (function (Core) {
        "use strict";
        class ODataService {
            constructor($q) {
                this._$q = $q;
            }
            GetEntities() {
                const defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityDefinitions()
                    .then((array) => {
                    defer.resolve(array);
                })
                    .catch((error) => {
                    defer.reject(error);
                });
                return defer.promise;
            }
            GetAttributes(entityDefinition) {
                const defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributesDefinition(entityDefinition.MetadataId)
                    .then((array) => {
                    defer.resolve(array);
                })
                    .catch((error) => {
                    defer.reject(error);
                });
                return defer.promise;
            }
            GetOptionSets(entityDefinition, attributeDefinition) {
                const defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributeOptionSetDefinition(entityDefinition.MetadataId, attributeDefinition.MetadataId)
                    .then((array) => {
                    defer.resolve(array);
                })
                    .catch((error) => {
                    defer.reject(error);
                });
                return defer.promise;
            }
        }
        function DataServiceFactory($q) {
            return new ODataService($q);
        }
        Core.dataService = "data-service";
        angular.module(Core.dataService, [])
            .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
    })(Core = Angular.Core || (Angular.Core = {}));
})(Angular || (Angular = {}));
