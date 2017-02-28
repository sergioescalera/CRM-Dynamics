var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var OData;
        (function (OData) {
            "use strict";
            function getContext() {
                var context;
                if (Xrm && Xrm.Page && Xrm.Page.context) {
                    context = Xrm.Page.context;
                }
                else if (GetGlobalContext) {
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
            function entitySetName(entityName) {
                return entityName + "s";
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
                    type: entityName,
                    attributes: {}
                };
                attributes.forEach(function (a) {
                    if (a === idFieldName) {
                        return;
                    }
                    var value = obj[a];
                    if (value !== undefined) {
                        entity.attributes[a] = { value: value };
                    }
                });
                return entity;
            }
            // entities CRUD
            function retrieve(entityName, entityId, attributes, expand) {
                var baseUrl = getContext().getClientUrl();
                var url = "{baseUrl}/api/data/{version}/{entitySetName}({entityId})?$select={select}"
                    .replace("{baseUrl}", baseUrl)
                    .replace("{version}", getVersion())
                    .replace("{entitySetName}", entitySetName(entityName))
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
                });
            }
            OData.retrieve = retrieve;
            function retrieveMultiple(entityName, attributes, filters) {
                var baseUrl = getContext().getClientUrl();
                var url = "{baseUrl}/api/data/{version}/{entitySetName}?$select={select}&$filter={filter}"
                    .replace("{baseUrl}", baseUrl)
                    .replace("{version}", getVersion())
                    .replace("{entitySetName}", entitySetName(entityName))
                    .replace("{select}", attributes.join(","))
                    .replace("{filter}", filters.join(","));
                return $
                    .ajax({
                    url: url,
                    dataType: "json"
                })
                    .then(function (data) {
                    var results = data.value;
                    return results.map(function (o) { return toEntity(entityName, attributes, o); });
                });
            }
            OData.retrieveMultiple = retrieveMultiple;
            function deleteEntity(entityName, entityId) {
                var baseUrl = getContext().getClientUrl();
                var url = "{0}/api/data/v8.1/{1}({2})"
                    .replace("{0}", baseUrl)
                    .replace("{1}", entitySetName(entityName))
                    .replace("{2}", entityId);
                return $
                    .ajax({
                    url: url,
                    dataType: "json",
                    type: "DELETE"
                });
            }
            OData.deleteEntity = deleteEntity;
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
//# sourceMappingURL=OData.js.map