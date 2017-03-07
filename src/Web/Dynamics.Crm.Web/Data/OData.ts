module Dynamics.Crm.OData {

    "use strict";

    function getContext(): Context {

        var context;

        if (Xrm && Xrm.Page && Xrm.Page.context) {

            context = Xrm.Page.context;

        } else if (GetGlobalContext) {

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

            console.warn("getContext().getVersion() is undefined");
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

        return entityName + "id";
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

    function stringifyEntity(entity: Core.IEntity) {

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

        var baseUrl = getContext().getClientUrl();

        var url = "{baseUrl}/api/data/{version}/{entitySetName}({entityId})?$select={select}"
            .replace("{baseUrl}", baseUrl)
            .replace("{version}", getVersion())
            .replace("{entitySetName}", entitySetName)
            .replace("{entityId}", Core.parseIdentifier(entityId))
            .replace("{select}", attributes.join(","));

        if (expand) {

            url += "&$expand=" + expand.join(",");
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
                    response.responseJSON.error.message,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    export function retrieveMultiple(
        entityName: string,
        entitySetName: string,
        attributes: string[],
        filters: string[]): JQueryPromise<Core.IEntity[]> {

        var baseUrl = getContext().getClientUrl();

        var url = "{baseUrl}/api/data/{version}/{entitySetName}?$select={select}&$filter={filter}"
            .replace("{baseUrl}", baseUrl)
            .replace("{version}", getVersion())
            .replace("{entitySetName}", entitySetName)
            .replace("{select}", attributes.join(","))
            .replace("{filter}", filters.join(","));

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
                    response.responseJSON.error.message,
                    response.responseJSON.error.innererror || response.responseJSON.error);
            });
    }

    export function deleteEntity(entityName: string, entitySetName: string, entityId: string): JQueryPromise<void> {

        var baseUrl = getContext().getClientUrl();

        var url = "{0}/api/data/v8.1/{1}({2})"
            .replace("{0}", baseUrl)
            .replace("{1}", entitySetName)
            .replace("{2}", entityId);

        return $
            .ajax({
                url: url,
                dataType: "json",
                type: "DELETE"
            });
    }

    export function createEntity(entity: Core.IEntity, entitySetName: string): JQueryPromise<void> {
        
        var baseUrl = getContext().getClientUrl();

        var url = "{0}/api/data/v8.1/{1}"
            .replace("{0}", baseUrl)
            .replace("{1}", entitySetName);

        var data = stringifyEntity(entity);

        return $
            .ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "POST",
                data: data
            });
    }

    // meta-data

    export function entityDefinitions(): JQueryPromise<IEntityDefinition[]> {

        var baseUrl = getContext().getClientUrl();

        var url = "{baseUrl}/api/data/{version}/EntityDefinitions"
            .replace("{baseUrl}", baseUrl)
            .replace("{version}", getVersion());

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: IODataResponse<IEntityDefinition[]>) => {

                return !data ? [] : data.value;
            });
    }

    export function entityAttributesDefinition(metadataId: string): JQueryPromise<IAttributeDefinition[]> {

        var baseUrl = getContext().getClientUrl();

        var url = "{baseUrl}/api/data/{version}/EntityDefinitions({metadataId})/Attributes"
            .replace("{baseUrl}", baseUrl)
            .replace("{version}", getVersion())
            .replace("{metadataId}", metadataId);

        return $
            .ajax({
                url: url,
                dataType: "json"
            })
            .then((data: IODataResponse<IAttributeDefinition[]>) => {

                return data.value;
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
}

interface ILocalizedName {
    LocalizedLabels: ILocalizedLabel[];
}

interface ILocalizedLabel {
    Label: string;
}