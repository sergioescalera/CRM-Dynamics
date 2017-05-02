var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        var ODataService = (function () {
            function ODataService($q) {
                this._$q = $q;
            }
            ODataService.prototype.GetEntities = function () {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityDefinitions()
                    .done(function (array) {
                    defer.resolve(array);
                })
                    .fail(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            ODataService.prototype.GetAttributes = function (entityDefinition) {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributesDefinition(entityDefinition.MetadataId)
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
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));
