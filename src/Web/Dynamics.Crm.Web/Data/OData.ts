module Dynamics.Crm.OData {

    "use strict";

    export enum FilterType {
        And = 1,
        Or = 2
    }

    function getContext(): Context {

        let context;

        if (typeof Xrm !== "undefined" &&
            typeof Xrm.Utility !== "undefined" &&
            typeof Xrm.Utility.getGlobalContext === "function") {

            context = Xrm.Utility.getGlobalContext();

        } else if (typeof GetGlobalContext === "function") {

            context = GetGlobalContext();
        }

        if (!context) {
            throw new Error("Unable to resolve CRM Global Context.");
        }

        return context;
    }

    function getVersion(): string {

        let version = getContext().getVersion(); // 8.2.0.780

        if (version === undefined) {

            Diagnostics.log.Warning("getContext().getVersion() is undefined");

            return "v9.0";
        }

        if (version >= "9.0") {
            return "v9.0";
        }

        if (version >= "8.2") {
            return "v8.2";
        }

        if (version >= "8.1") {
            return "v8.1";
        }

        if (version >= "8.0") {
            return "v8.0";
        }

        throw new Error("Version not supported: {version}.".replace("{version}", version));
    }

    function entityIdFieldName(entityName: string): string {

        return `${entityName}id`;
    }

    function toEntity(entityName: string, attributes: string[], obj: any): Core.IEntity {

        if (!obj) {
            return null;
        }

        let idFieldName = entityIdFieldName(entityName);

        let entity = {
            id: obj[idFieldName],
            type: entityName
        };

        attributes.forEach((key: string) => {

            if (key === idFieldName) {
                return;
            }

            let value = obj[key];

            if (value !== undefined) {
                entity[key] = value;
            }
        });

        return entity;
    }
    
    function sanitizeEntity(entity: Core.IEntity): any {

        let data = {};

        Object
            .keys(entity)
            .forEach((k: string) => {

                if (k === "id" || k === "type") {
                    return;
                }

                data[k] = entity[k];
            });

        return data;
    }

    // entities CRUD

    export function retrieve(
        entityName: string,
        entitySetName: string,
        entityId: string,
        attributes: string[],
        expand?: string[]): Promise<Core.IEntity> {
        
        Validation.ensureNotNullOrEmpty(entityName, "entityName");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
        Validation.ensureNotNullOrEmpty(entityId, "entityId");
        
        let query = `?$select=${attributes.join(",")}`;

        if (expand && expand.length) {

            query += `&$expand=${expand.join(",")}`;
        }

        return new Promise((resolve, reject) => {

            Xrm.WebApi.retrieveRecord(entityName, entityId, query)
                .then((entity: any) => {

                    resolve(toEntity(entityName, attributes, entity));

                }, (error) => {
                    
                    Diagnostics.log.Error(`${error.message} retrieve ${entityName}:${entityId}:${query}`, {
                        message: error.message,
                        description: `Code: ${error.errorCode}`,
                        name: "WebApiError"
                    });

                    reject(error);
                });
        });
    }

    export function retrieveMultiple(
        entityName: string,
        entitySetName: string,
        attributes: string[],
        filters: string[],
        filterType: FilterType = null,
        orderBy: string[] = null,
        expand: string[] = null,
        pageSize: number = 1000): Promise<Core.IEntity[]> {

        Validation.ensureNotNullOrEmpty(entityName, "entityName");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
        
        let filterJoin = !filterType || filterType === FilterType.And ? " and " : " or ";

        let query = `?$select=${attributes.join(",")}&$filter=${filters.join(filterJoin)}`;

        if (orderBy) {

            query += `&$orderby=${orderBy.join(",")}`;
        }

        if (expand) {

            query += `&$expand=${expand.join(",")}`;
        }

        return new Promise((resolve, reject) => {

            Xrm.WebApi.retrieveMultipleRecords(entityName, query, pageSize)
                .then(response => {

                    resolve(response.entities.map(entity => toEntity(entityName, attributes, entity)));

                }, (error) => {

                    Diagnostics.log.Error(`${error.message} retrieve multiple ${entityName}:${query}`, {
                        message: error.message,
                        description: `Code: ${error.errorCode}`,
                        name: "WebApiError"
                    });

                    reject(error);
                });
        });
    }

    export function deleteEntity(
        entityName: string,
        entitySetName: string,
        entityId: string): Promise<IEntity> {

        Validation.ensureNotNullOrEmpty(entityName, "entityName");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
        Validation.ensureNotNullOrEmpty(entityId, "entityId");

        return new Promise((resolve, reject) => {

            Xrm.WebApi.deleteRecord(entityName, entityId)
                .then((entity: WebApiEntityRef) => {

                    resolve({
                        type: entity.entityType,
                        id: entity.id,
                        name: entity.name
                    });

                }, (error) => {

                    Diagnostics.log.Error(`${error.message} delete ${entityName}`, {
                        message: error.message,
                        description: `Code: ${error.errorCode}`,
                        name: "WebApiError"
                    });

                    reject(error);
                });
        });
    }

    export function createEntity(
        entity: Core.IEntity,
        entitySetName: string,
        attributes: string[] = null,
        logError = true): Promise<Core.IEntity> {

        Validation.ensureNotNullOrUndefined(entity, "entity");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");

        let idFieldName = entityIdFieldName(entity.type);

        attributes = attributes || [];

        if (attributes.indexOf(idFieldName) < 0) {
            attributes.push(idFieldName);
        }

        let query = `?$select=${attributes.join(",")}`;

        let data = sanitizeEntity(entity);

        return new Promise((resolve, reject) => {

            Xrm.WebApi.createRecord(entity.type, data)
                .then((entity: WebApiEntityRef) => {

                    resolve({
                        type: entity.entityType,
                        id: entity.id
                    });

                }, (error) => {

                    if (logError) {
                        Diagnostics.log.Error(`${error.message} create ${entity.type}`, {
                            message: error.message,
                            description: `Code: ${error.errorCode}`,
                            name: "WebApiError"
                        });
                    }

                    reject(error);
                });
        });
    }

    export function updateEntity(entity: Core.IEntity, entitySetName: string): Promise<Core.IEntity> {

        Validation.ensureNotNullOrUndefined(entity, "entity");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
        
        let data = sanitizeEntity(entity);

        return new Promise((resolve, reject) => {

            Xrm.WebApi.updateRecord(entity.type, entity.id, data)
                .then((entity: WebApiEntityRef) => {

                    resolve({
                        type: entity.entityType,
                        id: entity.id
                    });

                }, (error) => {

                    Diagnostics.log.Error(`${error.message} update ${entity.type}:${entity.id}`, {
                        message: error.message,
                        description: `Code: ${error.errorCode}`,
                        name: "WebApiError"
                    });

                    reject(error);
                });
        });
    }

    // fetch

    export function fetch(
        entityName: string,
        entitySetName: string,
        fetchXml: string,
        pageSize: number = 500): Promise<WebApiRetrieveMultipleResponse> {
        
        let query = `?fetchXml=${encodeURIComponent(fetchXml)}`;

        return new Promise((resolve, reject) => {

            Xrm.WebApi.retrieveMultipleRecords(entityName, query, pageSize)
                .then(response => {

                    resolve(response);

                }, (error) => {

                    Diagnostics.log.Error(`${error.message} fetch ${entityName}:${query}`, {
                        message: error.message,
                        description: `Code: ${error.errorCode}`,
                        name: "WebApiError"
                    });

                    reject(error);
                });
        });
    }

    // meta-data

    let entityDefinitionAttributes: string[] = [
        "MetadataId",
        "DisplayName",
        "LogicalName",
        "ObjectTypeCode",
        "SchemaName"
    ];

    export function entityDefinitions(
        attributes: string[] = entityDefinitionAttributes): Promise<IEntityDefinition[]> {
        
        let query = `?$select=${attributes.join(",")}`;

        return new Promise((resolve, reject) => {
            
            Xrm.WebApi.retrieveMultipleRecords("EntityDefinition", query, 500)
                .then((response) => {
                    
                    resolve(response.entities);

                }, (error) => {

                    console.error(error);

                    reject(error);
                });
        });
    }

    let entityAttributeDefinitionAttributes: string[] = [
        "MetadataId",
        "DisplayName",
        "LogicalName",
        "AttributeType",
        "Description"
    ];

    export function entityAttributesDefinition(
        metadataId: string,
        attributes: string[] = entityAttributeDefinitionAttributes): JQueryPromise<IAttributeDefinition[]> {

        Validation.ensureNotNullOrEmpty(metadataId, "metadataId");

        let baseUrl: string = getContext().getClientUrl();

        let url = `${baseUrl}/api/data/${getVersion()}/EntityDefinitions(${metadataId})/Attributes?$select=${attributes.join(",")}`;

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: IODataResponse<IAttributeDefinition[]>) => {

                return data.value;
            });
    }

    export function entityAttributeOptionSetDefinition(
        metadataId: string,
        attributeMetadataId: string): JQueryPromise<IOptionSetValueDefinition[]> {

        Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
        Validation.ensureNotNullOrEmpty(attributeMetadataId, "attributeMetadataId");

        let baseUrl: string = getContext().getClientUrl();

        let url = `${baseUrl}/api/data/v8.0/EntityDefinitions(${metadataId})/Attributes(${attributeMetadataId})/Microsoft.Dynamics.CRM.PicklistAttributeMetadata/OptionSet?$select=Options`;

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: any) => {
                return data ? data.Options : [];
            });
    }
}

interface IODataResponse<TValue> {
    value: TValue;
}

interface IEntityDefinition {
    DisplayName?: ILocalizedName;
    LogicalName?: string;
    MetadataId?: string;
    ObjectTypeCode?: number;
    SchemaName?: string;
}

interface IAttributeDefinition {
    AttributeType?: string;
    Description?: ILocalizedName;
    DisplayName?: ILocalizedName;
    LogicalName?: string;
    MetadataId?: string;
}

interface IOptionSetValueDefinition {
    Description?: ILocalizedName;
    Label?: ILocalizedName;
    Value?: number;
}

interface ILocalizedName {
    LocalizedLabels?: ILocalizedLabel[];
    UserLocalizedLabel?: ILocalizedLabel;
}

interface ILocalizedLabel {
    Label?: string;
}