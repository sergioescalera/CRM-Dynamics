var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var OData;
        (function (OData) {
            "use strict";
            (function (FilterType) {
                FilterType[FilterType["And"] = 1] = "And";
                FilterType[FilterType["Or"] = 2] = "Or";
            })(OData.FilterType || (OData.FilterType = {}));
            var FilterType = OData.FilterType;
            function getContext() {
                var context;
                if (typeof Xrm !== "undefined" &&
                    typeof Xrm.Page !== "undefined" &&
                    typeof Xrm.Page.context !== "undefined") {
                    context = Xrm.Page.context;
                }
                else if (typeof GetGlobalContext !== "undefined") {
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
            function stringifyEntity(entity) {
                var data = {};
                Object
                    .keys(entity)
                    .forEach(function (k) {
                    if (k === "id" || k === "type") {
                        return;
                    }
                    data[k] = entity[k];
                });
                return JSON.stringify(data);
            }
            // entities CRUD
            function retrieve(entityName, entitySetName, entityId, attributes, expand) {
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                Validation.ensureNotNullOrEmpty(entityId, "entityId");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/" + entitySetName + "(" + Crm.Core.parseIdentifier(entityId) + ")?$select=" + attributes.join(",");
                if (expand) {
                    url += "&$expand=" + expand.join(",");
                }
                return $
                    .ajax({
                    url: url,
                    dataType: "json"
                })
                    .then(function (data) {
                    return toEntity(entityName, attributes, data);
                })
                    .fail(function (response) {
                    if (!response || !response.responseJSON || !response.responseJSON.error) {
                        return;
                    }
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message + " retrieve " + url, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.retrieve = retrieve;
            function retrieveMultiple(entityName, entitySetName, attributes, filters, filterType, orderBy, expand) {
                if (filterType === void 0) { filterType = null; }
                if (orderBy === void 0) { orderBy = null; }
                if (expand === void 0) { expand = null; }
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                var baseUrl = getContext().getClientUrl();
                var filterJoin = !filterType || filterType === FilterType.And ? " and " : " or ";
                var url = baseUrl + "/api/data/" + getVersion() + "/" + entitySetName + "?$select=" + attributes.join(",") + "&$filter=" + filters.join(filterJoin);
                if (orderBy) {
                    url += "&$orderby=" + orderBy.join(",");
                }
                if (expand) {
                    url += "&$expand=" + expand.join(",");
                }
                return $
                    .ajax({
                    url: url,
                    dataType: "json"
                })
                    .then(function (data) {
                    var results = data.value;
                    return results.map(function (o) { return toEntity(entityName, attributes, o); });
                })
                    .fail(function (response) {
                    if (!response || !response.responseJSON || !response.responseJSON.error) {
                        return;
                    }
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message + " retrieve multiple " + url, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.retrieveMultiple = retrieveMultiple;
            function deleteEntity(entityName, entitySetName, entityId) {
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                Validation.ensureNotNullOrEmpty(entityId, "entityId");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/" + entitySetName + "(" + Crm.Core.parseIdentifier(entityId) + ")";
                return $
                    .ajax({
                    url: url,
                    dataType: "json",
                    type: "DELETE"
                })
                    .fail(function (response) {
                    if (!response || !response.responseJSON || !response.responseJSON.error) {
                        return;
                    }
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message + " delete " + url, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.deleteEntity = deleteEntity;
            function createEntity(entity, entitySetName, attributes) {
                if (attributes === void 0) { attributes = null; }
                Validation.ensureNotNullOrUndefined(entity, "entity");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                var baseUrl = getContext().getClientUrl();
                var idFieldName = entityIdFieldName(entity.type);
                attributes = attributes || [];
                if (attributes.indexOf(idFieldName) < 0) {
                    attributes.push(idFieldName);
                }
                var url = baseUrl + "/api/data/" + getVersion() + "/" + entitySetName + "?$select=" + attributes.join(",");
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
                    .then(function (data) {
                    return toEntity(entity.type, attributes, data);
                })
                    .fail(function (response) {
                    if (!response || !response.responseJSON || !response.responseJSON.error) {
                        return;
                    }
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message + " create " + url, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.createEntity = createEntity;
            function updateEntity(entity, entitySetName) {
                Validation.ensureNotNullOrUndefined(entity, "entity");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/" + entitySetName + "(" + Crm.Core.parseIdentifier(entity.id) + ")";
                var data = stringifyEntity(entity);
                return $
                    .ajax({
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "PATCH",
                    data: data
                })
                    .fail(function (response) {
                    if (!response || !response.responseJSON || !response.responseJSON.error) {
                        return;
                    }
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message + " update " + url, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.updateEntity = updateEntity;
            // meta-data
            var entityDefinitionAttributes = [
                "MetadataId",
                "DisplayName",
                "LogicalName",
                "ObjectTypeCode",
                "SchemaName"
            ];
            function entityDefinitions(attributes) {
                if (attributes === void 0) { attributes = entityDefinitionAttributes; }
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/EntityDefinitions?$select=" + attributes.join(",");
                return $
                    .ajax({
                    url: url,
                    dataType: "json"
                })
                    .then(function (data) {
                    return !data ? [] : data.value;
                });
            }
            OData.entityDefinitions = entityDefinitions;
            var entityAttributeDefinitionAttributes = [
                "MetadataId",
                "DisplayName",
                "LogicalName",
                "AttributeType",
                "Description"
            ];
            function entityAttributesDefinition(metadataId, attributes) {
                if (attributes === void 0) { attributes = entityAttributeDefinitionAttributes; }
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/" + getVersion() + "/EntityDefinitions(" + metadataId + ")/Attributes?$select=" + attributes.join(",");
                return $
                    .ajax({
                    url: url,
                    dataType: "json"
                })
                    .then(function (data) {
                    return data.value;
                });
            }
            OData.entityAttributesDefinition = entityAttributesDefinition;
            function entityAttributeOptionSetDefinition(metadataId, attributeMetadataId) {
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
                Validation.ensureNotNullOrEmpty(attributeMetadataId, "attributeMetadataId");
                var baseUrl = getContext().getClientUrl();
                var url = baseUrl + "/api/data/v8.0/EntityDefinitions(" + metadataId + ")/Attributes(" + attributeMetadataId + ")/Microsoft.Dynamics.CRM.PicklistAttributeMetadata/OptionSet?$select=Options";
                return $
                    .ajax({
                    url: url,
                    dataType: "json"
                })
                    .then(function (data) {
                    return data.Options;
                });
            }
            OData.entityAttributeOptionSetDefinition = entityAttributeOptionSetDefinition;
        })(OData = Crm.OData || (Crm.OData = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
