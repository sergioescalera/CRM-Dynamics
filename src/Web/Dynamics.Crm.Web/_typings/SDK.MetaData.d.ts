declare var SDK: ISdkObject;

interface ISdkObject {
    Metadata: ISdkMetadata;
}

interface ISdkMetadata {
    EntityFilters: ISdkEntityFilters;
    RetrieveEntity(
        entityFilters: number,
        logicalName: string,
        metadataId: string,
        retrieveAsIfPublished: boolean,
        successCallBack: Function,
        errorCallBack: Function): void;
    RetrieveAllEntities(
        entityFilters: number,
        retrieveAsIfPublished: boolean,
        successCallBack: Function,
        errorCallBack: Function): void;
}

interface ISdkEntityFilters {
    Attributes: number;
    Entity: number;
}