var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var OData;
        (function (OData) {
            "use strict";
            let FilterType;
            (function (FilterType) {
                FilterType[FilterType["And"] = 1] = "And";
                FilterType[FilterType["Or"] = 2] = "Or";
            })(FilterType = OData.FilterType || (OData.FilterType = {}));
            function getContext() {
                let context;
                if (typeof Xrm !== "undefined" &&
                    typeof Xrm.Utility !== "undefined" &&
                    typeof Xrm.Utility.getGlobalContext === "function") {
                    context = Xrm.Utility.getGlobalContext();
                }
                else if (typeof GetGlobalContext === "function") {
                    context = GetGlobalContext();
                }
                if (!context) {
                    throw new Error("Unable to resolve CRM Global Context.");
                }
                return context;
            }
            function getVersion() {
                let version = getContext().getVersion(); // 8.2.0.780
                if (version === undefined) {
                    Crm.Diagnostics.log.Warning("getContext().getVersion() is undefined");
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
            function entityIdFieldName(entityName) {
                return `${entityName}id`;
            }
            function toEntity(entityName, attributes, obj) {
                if (!obj) {
                    return null;
                }
                let idFieldName = entityIdFieldName(entityName);
                let entity = {
                    id: obj[idFieldName],
                    type: entityName
                };
                attributes.forEach((key) => {
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
            function sanitizeEntity(entity) {
                let data = {};
                Object
                    .keys(entity)
                    .forEach((k) => {
                    if (k === "id" || k === "type") {
                        return;
                    }
                    data[k] = entity[k];
                });
                return data;
            }
            // entities CRUD
            function retrieve(entityName, entitySetName, entityId, attributes, expand) {
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                Validation.ensureNotNullOrEmpty(entityId, "entityId");
                let query = `?$select=${attributes.join(",")}`;
                if (expand && expand.length) {
                    query += `&$expand=${expand.join(",")}`;
                }
                return new Promise((resolve, reject) => {
                    Xrm.WebApi.retrieveRecord(entityName, entityId, query)
                        .then((entity) => {
                        resolve(toEntity(entityName, attributes, entity));
                    }, (error) => {
                        Crm.Diagnostics.log.Error(`${error.message} retrieve ${entityName}:${entityId}:${query}`, {
                            message: error.message,
                            description: `Code: ${error.errorCode}`,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.retrieve = retrieve;
            function retrieveMultiple(entityName, entitySetName, attributes, filters, filterType = null, orderBy = null, expand = null, pageSize = 1000) {
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
                        Crm.Diagnostics.log.Error(`${error.message} retrieve multiple ${entityName}:${query}`, {
                            message: error.message,
                            description: `Code: ${error.errorCode}`,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.retrieveMultiple = retrieveMultiple;
            function deleteEntity(entityName, entitySetName, entityId) {
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                Validation.ensureNotNullOrEmpty(entityId, "entityId");
                return new Promise((resolve, reject) => {
                    Xrm.WebApi.deleteRecord(entityName, entityId)
                        .then((entity) => {
                        let result = {
                            type: entity.entityType,
                            id: entity.id,
                            name: entity.name
                        };
                        resolve(result);
                    }, (error) => {
                        Crm.Diagnostics.log.Error(`${error.message} delete ${entityName}`, {
                            message: error.message,
                            description: `Code: ${error.errorCode}`,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.deleteEntity = deleteEntity;
            function createEntity(entity, entitySetName, attributes = null, logError = true) {
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
                        .then((entity) => {
                        resolve({
                            type: entity.entityType,
                            id: entity.id
                        });
                    }, (error) => {
                        if (logError) {
                            Crm.Diagnostics.log.Error(`${error.message} create ${entity.type}`, {
                                message: error.message,
                                description: `Code: ${error.errorCode}`,
                                name: "WebApiError"
                            });
                        }
                        reject(error);
                    });
                });
            }
            OData.createEntity = createEntity;
            function updateEntity(entity, entitySetName) {
                Validation.ensureNotNullOrUndefined(entity, "entity");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                let data = sanitizeEntity(entity);
                return new Promise((resolve, reject) => {
                    Xrm.WebApi.updateRecord(entity.type, entity.id, data)
                        .then((entity) => {
                        resolve({
                            type: entity.entityType,
                            id: entity.id
                        });
                    }, (error) => {
                        Crm.Diagnostics.log.Error(`${error.message} update ${entity.type}:${entity.id}`, {
                            message: error.message,
                            description: `Code: ${error.errorCode}`,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.updateEntity = updateEntity;
            // fetch
            function fetch(entityName, entitySetName, fetchXml, pageSize = 500) {
                let query = `?fetchXml=${encodeURIComponent(fetchXml)}`;
                return new Promise((resolve, reject) => {
                    Xrm.WebApi.retrieveMultipleRecords(entityName, query, pageSize)
                        .then(response => {
                        resolve(response);
                    }, (error) => {
                        Crm.Diagnostics.log.Error(`${error.message} fetch ${entityName}:${query}`, {
                            message: error.message,
                            description: `Code: ${error.errorCode}`,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.fetch = fetch;
            // meta-data
            let entityDefinitionAttributes = [
                "MetadataId",
                "DisplayName",
                "LogicalName",
                "ObjectTypeCode",
                "SchemaName",
                "EntitySetName",
                "PrimaryIdAttribute",
                "ExternalName"
            ];
            let entityAttributeDefinitionAttributes = [
                "MetadataId",
                "DisplayName",
                "LogicalName",
                "AttributeType",
                "Description"
            ];
            function entityDefinitions(attributes = entityDefinitionAttributes) {
                let baseUrl = getContext().getClientUrl();
                let url = `${baseUrl}/api/data/${getVersion()}/EntityDefinitions?$select=${attributes.join(",")}`;
                return new Promise((resolve, reject) => {
                    return $
                        .ajax({
                        url: url,
                        dataType: "json"
                    })
                        .then((data) => {
                        resolve(!data ? [] : data.value);
                    })
                        .fail((error) => reject(error));
                });
            }
            OData.entityDefinitions = entityDefinitions;
            function entityAttributesDefinition(metadataId, attributes = entityAttributeDefinitionAttributes) {
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
                let baseUrl = getContext().getClientUrl();
                let url = `${baseUrl}/api/data/${getVersion()}/EntityDefinitions(${metadataId})/Attributes?$select=${attributes.join(",")}`;
                return new Promise((resolve, reject) => {
                    return $
                        .ajax({
                        url: url,
                        dataType: "json"
                    })
                        .then((data) => {
                        resolve(data.value);
                    })
                        .fail((error) => reject(error));
                });
            }
            OData.entityAttributesDefinition = entityAttributesDefinition;
            function entityAttributeOptionSetDefinition(metadataId, attributeMetadataId) {
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
                Validation.ensureNotNullOrEmpty(attributeMetadataId, "attributeMetadataId");
                let baseUrl = getContext().getClientUrl();
                let url = `${baseUrl}/api/data/v8.0/EntityDefinitions(${metadataId})/Attributes(${attributeMetadataId})/Microsoft.Dynamics.CRM.PicklistAttributeMetadata/OptionSet?$select=Options`;
                return new Promise((resolve, reject) => {
                    return $
                        .ajax({
                        url: url,
                        dataType: "json"
                    })
                        .then((data) => {
                        resolve(data ? data.Options : []);
                    })
                        .fail((error) => reject(error));
                });
            }
            OData.entityAttributeOptionSetDefinition = entityAttributeOptionSetDefinition;
        })(OData = Crm.OData || (Crm.OData = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
