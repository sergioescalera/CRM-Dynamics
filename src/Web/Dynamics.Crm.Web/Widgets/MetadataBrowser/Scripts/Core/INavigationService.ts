module MetadataBrower.Core {

    "use strict";

    export interface INavigationService {
        AddEntityTab(entity: IEntityDefinition): void;
        DeleteEntityTab(tab: INavigationTab): void;
        SelectedIndex: number;
    }
}