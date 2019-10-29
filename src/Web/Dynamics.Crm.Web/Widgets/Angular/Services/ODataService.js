var Angular;
(function (Angular) {
    var Core;
    (function (Core) {
        "use strict";
        var ODataService = /** @class */ (function () {
            function ODataService($q) {
                this._$q = $q;
            }
            ODataService.prototype.GetEntities = function () {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityDefinitions()
                    .then(function (array) {
                    defer.resolve(array);
                })
                    .catch(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            ODataService.prototype.GetAttributes = function (entityDefinition) {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributesDefinition(entityDefinition.MetadataId)
                    .then(function (array) {
                    defer.resolve(array);
                })
                    .fail(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            ODataService.prototype.GetOptionSets = function (entityDefinition, attributeDefinition) {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributeOptionSetDefinition(entityDefinition.MetadataId, attributeDefinition.MetadataId)
                    .done(function (array) {
                    defer.resolve(array);
                })
                    .fail(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            return ODataService;
        }());
        function DataServiceFactory($q) {
            return new ODataService($q);
        }
        Core.dataService = "data-service";
        angular.module(Core.dataService, [])
            .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
    })(Core = Angular.Core || (Angular.Core = {}));
})(Angular || (Angular = {}));
