module MetadataBrower.Core {

    "use strict";

    export interface IDataService {
        GetEntities(): ng.IPromise<IEntityDefinition[]>;
        GetAttributes(entityDefinition: IEntityDefinition): ng.IPromise<IAttributeDefinition[]>;
    }
}