module Dynamics.Crm.OData {

    "use strict";

    export enum FilterType {
        And = 1,
        Or = 2
    }

    function getContext(): Context {

        var context;

        if (typeof Xrm !== "undefined" &&
            typeof Xrm.Page !== "undefined" &&
            typeof Xrm.Page.context !== "undefined") {

            context = Xrm.Page.context;

        } else if (typeof GetGlobalContext !== "undefined") {

            context = GetGlobalContext();
        }

        if (!context) {
            throw new Error("Unable to resolve CRM Global Context.");
        }

        return context;
    }

    function getVersion(): string {

        var version = getContext().getVersion(); // 8.2.0.780

        if (version === undefined) {

            Diagnostics.log.Warning("getContext().getVersion() is undefined");
            return "v8.0";
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

        var idFieldName = entityIdFieldName(entityName);

        var entity = {
            id: obj[idFieldName],
            type: entityName
        };

        attributes.forEach((key: string) => {

            if (key === idFieldName) {
                return;
            }

            var value = obj[key];

            if (value !== undefined) {
                entity[key] = value;
            }
        });

        return entity;
    }

    function stringifyEntity(entity: Core.IEntity): string {

        var data = {};

        Object
            .keys(entity)
            .forEach((k: string) => {

                if (k === "id" || k === "type") {
                    return;
                }

                data[k] = entity[k];
            });

        return JSON.stringify(data);
    }

    // entities CRUD

    export function retrieve(
        entityName: string,
        entitySetName: string,
        entityId: string,
        attributes: string[],
        expand?: string[]): JQueryPromise<Core.IEntity> {

        Validation.ensureNotNullOrEmpty(entityName, "entityName");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
        Validation.ensureNotNullOrEmpty(entityId, "entityId");

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/${getVersion()}/${entitySetName}(${Core.parseIdentifier(entityId)})?$select=${attributes.join(",") }`;

        if (expand) {

            url += `&$expand=${expand.join(",")}`;
        }

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: any) => {

                return toEntity(entityName, attributes, data);
            })
            .fail((response: any) => {

                if (!response || !response.responseJSON || !response.responseJSON.error) {
                    return;
                }

                Diagnostics.log.Error(
                    `${response.responseJSON.error.message} retrieve ${url}`,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    export function retrieveMultiple(
        entityName: string,
        entitySetName: string,
        attributes: string[],
        filters: string[],
        filterType: FilterType = null,
        orderBy: string[] = null,
        expand: string[] = null): JQueryPromise<Core.IEntity[]> {

        Validation.ensureNotNullOrEmpty(entityName, "entityName");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");

        var baseUrl = getContext().getClientUrl();

        var filterJoin = !filterType || filterType === FilterType.And ? " and " : " or ";

        var url = `${baseUrl}/api/data/${getVersion()}/${entitySetName}?$select=${attributes.join(",")}&$filter=${filters.join(filterJoin)}`;

        if (orderBy) {

            url += `&$orderby=${orderBy.join(",")}`;
        }

        if (expand) {

            url += `&$expand=${expand.join(",")}`;
        }

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: any) => {

                var results = <any[]>data.value;

                return results.map((o: any) => toEntity(entityName, attributes, o));
            })
            .fail((response: any) => {

                if (!response || !response.responseJSON || !response.responseJSON.error) {
                    return;
                }

                Diagnostics.log.Error(
                    `${response.responseJSON.error.message} retrieve multiple ${url}`,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    export function deleteEntity(
        entityName: string,
        entitySetName: string,
        entityId: string): JQueryPromise<void> {

        Validation.ensureNotNullOrEmpty(entityName, "entityName");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
        Validation.ensureNotNullOrEmpty(entityId, "entityId");

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/${getVersion()}/${entitySetName}(${Core.parseIdentifier(entityId)})`;

        return $
            .ajax({
                url: url,
                dataType: "json",
                type: "DELETE"
            })
            .fail((response: any) => {

                if (!response || !response.responseJSON || !response.responseJSON.error) {
                    return;
                }

                Diagnostics.log.Error(
                    `${response.responseJSON.error.message} delete ${url}`,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    export function createEntity(
        entity: Core.IEntity,
        entitySetName: string,
        attributes: string[] = null): JQueryPromise<Core.IEntity> {

        Validation.ensureNotNullOrUndefined(entity, "entity");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");

        var baseUrl = getContext().getClientUrl();
        var idFieldName = entityIdFieldName(entity.type);

        attributes = attributes || [];
        if (attributes.indexOf(idFieldName) < 0) {
            attributes.push(idFieldName);
        }

        var url = `${baseUrl}/api/data/${getVersion()}/${entitySetName}?$select=${attributes.join(",")}`;
        
        var data = stringifyEntity(entity);

        return $
            .ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "POST",
                data: data,
                headers: {
                    Prefer: "return=representation"
                }
            })
            .then((data: any) => {

                return toEntity(entity.type, attributes, data);
            })
            .fail((response: any) => {

                if (!response || !response.responseJSON || !response.responseJSON.error) {
                    return;
                }

                Diagnostics.log.Error(
                    `${response.responseJSON.error.message} create ${url}`,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    export function updateEntity(entity: Core.IEntity, entitySetName: string): JQueryPromise<void> {

        Validation.ensureNotNullOrUndefined(entity, "entity");
        Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/${getVersion()}/${entitySetName}(${Core.parseIdentifier(entity.id)})`;

        var data = stringifyEntity(entity);

        return $
            .ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "PATCH",
                data: data
            })
            .fail((response: any) => {

                if (!response || !response.responseJSON || !response.responseJSON.error) {
                    return;
                }

                Diagnostics.log.Error(
                    `${response.responseJSON.error.message} update ${url}`,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    // fetch

    export function fetch(entitySetName: string, fetchXml: string): JQueryPromise<any> {

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/${getVersion()}/${entitySetName}?fetchXml=${encodeURIComponent(fetchXml)}`;

        return $.ajax({
            url: url,
            dataType: "json",
        })
            .fail((response: any) => {

                if (!response || !response.responseJSON || !response.responseJSON.error) {
                    return;
                }

                Diagnostics.log.Error(
                    `${response.responseJSON.error.message} create ${url}`,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    // meta-data

    var entityDefinitionAttributes: string[] = [
        "MetadataId",
        "DisplayName",
        "LogicalName",
        "ObjectTypeCode",
        "SchemaName"
    ];

    export function entityDefinitions(
        attributes: string[] = entityDefinitionAttributes): JQueryPromise<IEntityDefinition[]> {

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/${getVersion()}/EntityDefinitions?$select=${attributes.join(",")}`;

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: IODataResponse<IEntityDefinition[]>) => {

                return !data ? [] : data.value;
            });
    }

    var entityAttributeDefinitionAttributes: string[] = [
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

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/${getVersion()}/EntityDefinitions(${metadataId})/Attributes?$select=${attributes.join(",")}`;

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

        var baseUrl = getContext().getClientUrl();

        var url = `${baseUrl}/api/data/v8.0/EntityDefinitions(${metadataId})/Attributes(${attributeMetadataId})/Microsoft.Dynamics.CRM.PicklistAttributeMetadata/OptionSet?$select=Options`;

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