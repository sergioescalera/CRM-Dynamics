var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var OData;
        (function (OData) {
            "use strict";
            var FilterType;
            (function (FilterType) {
                FilterType[FilterType["And"] = 1] = "And";
                FilterType[FilterType["Or"] = 2] = "Or";
            })(FilterType = OData.FilterType || (OData.FilterType = {}));
            function getContext() {
                var context;
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
                var version = getContext().getVersion(); // 8.2.0.780
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
                return entityName + "id";
            }
            function toEntity(entityName, attributes, obj) {
                if (!obj) {
                    return null;
                }
                var idFieldName = entityIdFieldName(entityName);
                var entity = {
                    id: obj[idFieldName],
                    type: entityName
                };
                attributes.forEach(function (key) {
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
            function sanitizeEntity(entity) {
                var data = {};
                Object
                    .keys(entity)
                    .forEach(function (k) {
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
                var query = "?$select=" + attributes.join(",");
                if (expand && expand.length) {
                    query += "&$expand=" + expand.join(",");
                }
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.retrieveRecord(entityName, entityId, query)
                        .then(function (entity) {
                        resolve(toEntity(entityName, attributes, entity));
                    }, function (error) {
                        Crm.Diagnostics.log.Error(error.message + " retrieve " + entityName + ":" + entityId + ":" + query, {
                            message: error.message,
                            description: "Code: " + error.errorCode,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.retrieve = retrieve;
            function retrieveMultiple(entityName, entitySetName, attributes, filters, filterType, orderBy, expand, pageSize) {
                if (filterType === void 0) { filterType = null; }
                if (orderBy === void 0) { orderBy = null; }
                if (expand === void 0) { expand = null; }
                if (pageSize === void 0) { pageSize = 1000; }
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                var filterJoin = !filterType || filterType === FilterType.And ? " and " : " or ";
                var query = "?$select=" + attributes.join(",") + "&$filter=" + filters.join(filterJoin);
                if (orderBy) {
                    query += "&$orderby=" + orderBy.join(",");
                }
                if (expand) {
                    query += "&$expand=" + expand.join(",");
                }
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.retrieveMultipleRecords(entityName, query, pageSize)
                        .then(function (response) {
                        resolve(response.entities.map(function (entity) { return toEntity(entityName, attributes, entity); }));
                    }, function (error) {
                        Crm.Diagnostics.log.Error(error.message + " retrieve multiple " + entityName + ":" + query, {
                            message: error.message,
                            description: "Code: " + error.errorCode,
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
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.deleteRecord(entityName, entityId)
                        .then(function (entity) {
                        var result = {
                            type: entity.entityType,
                            id: entity.id,
                            name: entity.name
                        };
                        resolve(result);
                    }, function (error) {
                        Crm.Diagnostics.log.Error(error.message + " delete " + entityName, {
                            message: error.message,
                            description: "Code: " + error.errorCode,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.deleteEntity = deleteEntity;
            function createEntity(entity, entitySetName, attributes, logError) {
                if (attributes === void 0) { attributes = null; }
                if (logError === void 0) { logError = true; }
                Validation.ensureNotNullOrUndefined(entity, "entity");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                var idFieldName = entityIdFieldName(entity.type);
                attributes = attributes || [];
                if (attributes.indexOf(idFieldName) < 0) {
                    attributes.push(idFieldName);
                }
                var query = "?$select=" + attributes.join(",");
                var data = sanitizeEntity(entity);
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.createRecord(entity.type, data)
                        .then(function (entity) {
                        resolve({
                            type: entity.entityType,
                            id: entity.id
                        });
                    }, function (error) {
                        if (logError) {
                            Crm.Diagnostics.log.Error(error.message + " create " + entity.type, {
                                message: error.message,
                                description: "Code: " + error.errorCode,
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
                var data = sanitizeEntity(entity);
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.updateRecord(entity.type, entity.id, data)
                        .then(function (entity) {
                        resolve({
                            type: entity.entityType,
                            id: entity.id
                        });
                    }, function (error) {
                        Crm.Diagnostics.log.Error(error.message + " update " + entity.type + ":" + entity.id, {
                            message: error.message,
                            description: "Code: " + error.errorCode,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.updateEntity = updateEntity;
            // fetch
            function fetch(entityName, entitySetName, fetchXml, pageSize) {
                if (pageSize === void 0) { pageSize = 500; }
                var query = "?fetchXml=" + encodeURIComponent(fetchXml);
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.retrieveMultipleRecords(entityName, query, pageSize)
                        .then(function (response) {
                        resolve(response);
                    }, function (error) {
                        Crm.Diagnostics.log.Error(error.message + " fetch " + entityName + ":" + query, {
                            message: error.message,
                            description: "Code: " + error.errorCode,
                            name: "WebApiError"
                        });
                        reject(error);
                    });
                });
            }
            OData.fetch = fetch;
            // meta-data
            var entityDefinitionAttributes = [
                "MetadataId",
                "DisplayName",
                "LogicalName",
                "ObjectTypeCode",
                "SchemaName",
                "EntitySetName",
                "PrimaryIdAttribute",
                "ExternalName"
            ];
            var entityAttributeDefinitionAttributes = [
                "MetadataId",
                "DisplayName",
                "LogicalName",
                "AttributeType",
                "Description"
            ];
            function entityDefinitions(attributes) {
                if (attributes === void 0) { attributes = entityDefinitionAttributes; }
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/EntityDefinitions?$select=" + attributes.join(",");
                return new Promise(function (resolve, reject) {
                    return $
                        .ajax({
                        url: url,
                        dataType: "json"
                    })
                        .then(function (data) {
                        resolve(!data ? [] : data.value);
                    })
                        .fail(function (error) { return reject(error); });
                });
            }
            OData.entityDefinitions = entityDefinitions;
            function entityAttributesDefinition(metadataId, attributes) {
                if (attributes === void 0) { attributes = entityAttributeDefinitionAttributes; }
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/EntityDefinitions(" + metadataId + ")/Attributes?$select=" + attributes.join(",");
                return new Promise(function (resolve, reject) {
                    return $
                        .ajax({
                        url: url,
                        dataType: "json"
                    })
                        .then(function (data) {
                        resolve(data.value);
                    })
                        .fail(function (error) { return reject(error); });
                });
            }
            OData.entityAttributesDefinition = entityAttributesDefinition;
            function entityAttributeOptionSetDefinition(metadataId, attributeMetadataId) {
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
                Validation.ensureNotNullOrEmpty(attributeMetadataId, "attributeMetadataId");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/v8.0/EntityDefinitions(" + metadataId + ")/Attributes(" + attributeMetadataId + ")/Microsoft.Dynamics.CRM.PicklistAttributeMetadata/OptionSet?$select=Options";
                return new Promise(function (resolve, reject) {
                    return $
                        .ajax({
                        url: url,
                        dataType: "json"
                    })
                        .then(function (data) {
                        resolve(data ? data.Options : []);
                    })
                        .fail(function (error) { return reject(error); });
                });
            }
            OData.entityAttributeOptionSetDefinition = entityAttributeOptionSetDefinition;
        })(OData = Crm.OData || (Crm.OData = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
