module MetadataBrower.Core {

    "use strict";

    class NavigationService implements INavigationService {

        SelectedIndex: number;

        EntityTabs: INavigationTab[] = [];

        AddEntityTab(entity: IEntityDefinition): void {

            var filtered: INavigationTab[] = this.EntityTabs
                .filter((x: INavigationTab) => x.entity.LogicalName === entity.LogicalName);

            if (filtered.length > 0) {

                this.SelectedIndex = this.EntityTabs.indexOf(filtered[0]) + 1;

            } else {

                this.EntityTabs.push({
                    entity: entity,
                    title: entity.SchemaName
                });
                this.SelectedIndex = this.EntityTabs.length;
            }
        }

        DeleteEntityTab(tab: INavigationTab): void {

            _.remove(this.EntityTabs, (t: INavigationTab) => t.entity.LogicalName === tab.entity.LogicalName);
        }
    }

    function NavigationServiceFactory(): INavigationService {

        return new NavigationService();
    }

    angular.module(Config.moduleName)
        .factory("metadataBrowser.core.navigationService", [NavigationServiceFactory]);
}