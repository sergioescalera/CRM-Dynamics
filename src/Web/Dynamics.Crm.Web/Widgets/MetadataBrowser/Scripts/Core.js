var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));
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
                    debugger;
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
            // return new DataService($q);
            return new ODataService($q);
        }
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));
var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        var NavigationService = (function () {
            function NavigationService() {
                this.EntityTabs = new Array();
            }
            NavigationService.prototype.AddEntityTab = function (entity) {
                var filter = this.EntityTabs.filter(function (x) { return x.entity.LogicalName === entity.LogicalName; });
                if (!!filter.length) {
                    filter[0].active = true;
                }
                else {
                    this.EntityTabs.push({
                        active: true,
                        entity: entity,
                        title: entity.SchemaName
                    });
                }
            };
            NavigationService.prototype.DeleteEntityTab = function (tab) {
                _.remove(this.EntityTabs, function (t) { return t.entity.LogicalName === tab.entity.LogicalName; });
            };
            return NavigationService;
        }());
        function NavigationServiceFactory() {
            return new NavigationService();
        }
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.navigationService", [NavigationServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));
//# sourceMappingURL=Core.js.map