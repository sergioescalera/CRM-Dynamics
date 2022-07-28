var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        class NavigationService {
            constructor() {
                this.EntityTabs = [];
            }
            AddEntityTab(entity) {
                var filtered = this.EntityTabs
                    .filter((x) => x.entity.LogicalName === entity.LogicalName);
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
            }
            DeleteEntityTab(tab) {
                _.remove(this.EntityTabs, (t) => t.entity.LogicalName === tab.entity.LogicalName);
            }
        }
        function NavigationServiceFactory() {
            return new NavigationService();
        }
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.navigationService", [NavigationServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));
