var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        var NavigationService = /** @class */ (function () {
            function NavigationService() {
                this.EntityTabs = [];
            }
            NavigationService.prototype.AddEntityTab = function (entity) {
                var filtered = this.EntityTabs
                    .filter(function (x) { return x.entity.LogicalName === entity.LogicalName; });
                if (filtered.length > 0) {
                    this.SelectedIndex = this.EntityTabs.indexOf(filtered[0]) + 1;
                }
                else {
                    this.EntityTabs.push({
                        entity: entity,
                        title: entity.SchemaName
                    });
                    this.SelectedIndex = this.EntityTabs.length;
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
