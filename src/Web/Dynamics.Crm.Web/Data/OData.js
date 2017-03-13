var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var OData;
        (function (OData) {
            "use strict";
            (function (FilterType) {
                FilterType[FilterType["And"] = 0] = "And";
                FilterType[FilterType["Or"] = 0] = "Or";
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
                var url = "{baseUrl}/api/data/{version}/{entitySetName}({entityId})?$select={select}"
                    .replace("{baseUrl}", baseUrl)
                    .replace("{version}", getVersion())
                    .replace("{entitySetName}", entitySetName)
                    .replace("{entityId}", Crm.Core.parseIdentifier(entityId))
                    .replace("{select}", attributes.join(","));
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
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.retrieve = retrieve;
            function retrieveMultiple(entityName, entitySetName, attributes, filters, filterType, orderBy) {
                if (filterType === void 0) { filterType = FilterType.And; }
                if (orderBy === void 0) { orderBy = null; }
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                var baseUrl = getContext().getClientUrl();
                var filterJoin = filterType === FilterType.And ? " and " : " or ";
                var url = "{baseUrl}/api/data/{version}/{entitySetName}?$select={select}&$filter={filter}"
                    .replace("{baseUrl}", baseUrl)
                    .replace("{version}", getVersion())
                    .replace("{entitySetName}", entitySetName)
                    .replace("{select}", attributes.join(","))
                    .replace("{filter}", filters.join(filterJoin));
                if (orderBy) {
                    url += "&$orderby={orderby}".replace("{orderby}", orderBy.join(","));
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
                    Crm.Diagnostics.log.Error(response.responseJSON.error.message, response.responseJSON.error.innererror || response.responseJSON.error);
                });
            }
            OData.retrieveMultiple = retrieveMultiple;
            function deleteEntity(entityName, entitySetName, entityId) {
                Validation.ensureNotNullOrEmpty(entityName, "entityName");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
                Validation.ensureNotNullOrEmpty(entityId, "entityId");
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
            OData.deleteEntity = deleteEntity;
            function createEntity(entity, entitySetName) {
                Validation.ensureNotNullOrUndefined(entity, "entity");
                Validation.ensureNotNullOrEmpty(entitySetName, "entitySetName");
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
            OData.createEntity = createEntity;
            // meta-data
            function entityDefinitions() {
                var baseUrl = getContext().getClientUrl();
                var url = "{baseUrl}/api/data/{version}/EntityDefinitions"
                    .replace("{baseUrl}", baseUrl)
                    .replace("{version}", getVersion());
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
            function entityAttributesDefinition(metadataId) {
                Validation.ensureNotNullOrEmpty(metadataId, "metadataId");
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
                    .then(function (data) {
                    return data.value;
                });
            }
            OData.entityAttributesDefinition = entityAttributesDefinition;
        })(OData = Crm.OData || (Crm.OData = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
