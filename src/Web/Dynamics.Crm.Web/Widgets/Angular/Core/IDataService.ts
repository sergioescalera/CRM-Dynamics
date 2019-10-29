module Angular.Core {

    "use strict";

    export interface IDataService {
        GetEntities(): ng.IPromise<IEntityDefinition[]>;
        GetAttributes(entityDefinition: IEntityDefinition): ng.IPromise<IAttributeDefinition[]>;
        GetOptionSets(
            entityDefinition: IEntityDefinition,
            attributeDefinition: IAttributeDefinition): ng.IPromise<IOptionSetValueDefinition[]>
    }
}