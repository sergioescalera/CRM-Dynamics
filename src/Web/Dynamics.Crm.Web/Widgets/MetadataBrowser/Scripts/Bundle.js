var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        "use strict";
        Crm.componentName = function (prefix, name) { return (prefix + "_" + name); };
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Publishers;
        (function (Publishers) {
            "use strict";
            Publishers.bootstrap = "cc";
            Publishers.logEntry = "cc";
        })(Publishers = Crm.Publishers || (Crm.Publishers = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Forms;
        (function (Forms) {
            "use strict";
            var FormNotificationType = (function () {
                function FormNotificationType() {
                }
                FormNotificationType.Error = "ERROR";
                FormNotificationType.Warning = "WARNING";
                FormNotificationType.Information = "INFO";
                return FormNotificationType;
            }());
            Forms.FormNotificationType = FormNotificationType;
            var ClientType = (function () {
                function ClientType() {
                }
                ClientType.Browser = "Web";
                ClientType.Outlook = "Outlook";
                ClientType.Mobile = "Mobile";
                return ClientType;
            }());
            Forms.ClientType = ClientType;
            var AttributeRequiredLevel = (function () {
                function AttributeRequiredLevel() {
                }
                AttributeRequiredLevel.None = "none";
                AttributeRequiredLevel.Required = "required";
                AttributeRequiredLevel.Recommended = "recommended";
                return AttributeRequiredLevel;
            }());
            Forms.AttributeRequiredLevel = AttributeRequiredLevel;
        })(Forms = Crm.Forms || (Crm.Forms = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Diagnostics;
        (function (Diagnostics) {
            "use strict";
            Diagnostics.debug = true;
            Diagnostics.trace = true;
            var ConsoleLogger = (function () {
                function ConsoleLogger(prefix) {
                    this._prefix = prefix;
                }
                ConsoleLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    var entry = createLogEntry(this._prefix, message, error);
                    console.error(entry);
                };
                ConsoleLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                ConsoleLogger.prototype.Warning = function (message) {
                    console.warn(message);
                };
                return ConsoleLogger;
            }());
            var LogEntryLogger = (function () {
                function LogEntryLogger(prefix) {
                    this._prefix = prefix;
                }
                LogEntryLogger.prototype.Error = function (message, error) {
                    if (Diagnostics.debug) {
                        debugger;
                    }
                    var entry = createLogEntry(this._prefix, message, error);
                    console.error(entry);
                    Dynamics.Crm.Data.unitOfWork
                        .GetLogEntryRepository(this._prefix)
                        .Create(entry);
                };
                LogEntryLogger.prototype.Message = function (message) {
                    console.log(message);
                };
                LogEntryLogger.prototype.Warning = function (message) {
                    console.warn(message);
                };
                return LogEntryLogger;
            }());
            // public functions
            function useLogEntryLogger(prefix) {
                Diagnostics.log = new LogEntryLogger(prefix || Crm.Publishers.logEntry);
            }
            Diagnostics.useLogEntryLogger = useLogEntryLogger;
            function useConsoleLogger(prefix) {
                Diagnostics.log = new ConsoleLogger(prefix || Crm.Publishers.logEntry);
            }
            Diagnostics.useConsoleLogger = useConsoleLogger;
            function printArguments() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log("Function " + arguments[0] + " called with arguments: {");
                for (var i = 1; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                console.log("}");
            }
            Diagnostics.printArguments = printArguments;
            // private function
            function createLogEntry(prefix, message, error) {
                var entityName = getEntityName();
                var entityId = getEntityId();
                var formType = getFormType();
                var clientType = getClientType();
                var formFactor = getFormFactor();
                var stack = error.stack || error.stacktrace || "<none>";
                var desc = error.description || "<none>";
                var source = "JavaScript::" + clientType + "," + formFactor + "," + formType + ":" + entityName + "(" + entityId + ")";
                var description = "Stack: " + stack + "\nDescription: " + desc;
                var entry = {
                    type: Crm.Data.Schema.LogEntryEntity.type(prefix)
                };
                var name = error.type ? error.type + ":" + message : message;
                var msg = message === error.message ? message : ((message + ". " + error.message).trim());
                entry[Crm.Data.Schema.LogEntryEntity.nameField(prefix)]
                    = Validation.Strings.left(name, 300);
                entry[Crm.Data.Schema.LogEntryEntity.messageField(prefix)]
                    = Validation.Strings.left(msg, 5000);
                entry[Crm.Data.Schema.LogEntryEntity.descriptionField(prefix)]
                    = Validation.Strings.right(description, 1048576);
                entry[Crm.Data.Schema.LogEntryEntity.sourceField(prefix)]
                    = Validation.Strings.left(source, 500);
                entry[Crm.Data.Schema.LogEntryEntity.typeField(prefix)]
                    = Dynamics.Crm.Core.LogEntryType.Error;
                return entry;
            }
            function getEntityName() {
                try {
                    return Xrm.Page.data.entity.getEntityName();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "UnknownEntity";
                }
            }
            function getEntityId() {
                try {
                    return Xrm.Page.data.entity.getId();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "";
                }
            }
            function getFormType() {
                try {
                    return Xrm.Page.ui.getFormType().toString();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "";
                }
            }
            function getFormFactor() {
                try {
                    return Crm.Forms.getFormFactor();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return -1;
                }
            }
            function getClientType() {
                try {
                    return Crm.Forms.getClientType();
                }
                catch (e) {
                    if (Diagnostics.trace && Diagnostics.log) {
                        Diagnostics.log.Warning(e);
                    }
                    return "unknown";
                }
            }
            // variables
            useLogEntryLogger();
        })(Diagnostics = Crm.Diagnostics || (Crm.Diagnostics = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Validation;
(function (Validation) {
    "use strict";
    function ensureNotNullOrUndefined(value, label) {
        if (value === undefined || value === null) {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }
    }
    Validation.ensureNotNullOrUndefined = ensureNotNullOrUndefined;
    function ensureNotNullOrEmpty(str, label) {
        if (str === undefined || str === null) {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }
        if (!_.isString(str)) {
            throw new Error(Resources.Strings.InvalidTypeMessageFormat("string", typeof str));
        }
        if (str === "") {
            throw new Error(Resources.Strings.NullArgumentMessageFormat(label));
        }
    }
    Validation.ensureNotNullOrEmpty = ensureNotNullOrEmpty;
    function ensureNumberInRange(value, min, max, paramName) {
        if (min === void 0) { min = null; }
        if (max === void 0) { max = null; }
        if (paramName === void 0) { paramName = null; }
        if (!_.isNumber(value)) {
            throw new Error(Resources.Strings.InvalidTypeMessageFormat("number", typeof value));
        }
        if (_.isNumber(min) && value < min) {
            throw new Error(Resources.Strings.OutOfRangeMessageFormat(paramName));
        }
        if (_.isNumber(max) && value > max) {
            throw new Error(Resources.Strings.OutOfRangeMessageFormat(paramName));
        }
    }
    Validation.ensureNumberInRange = ensureNumberInRange;
})(Validation || (Validation = {}));
var Validation;
(function (Validation) {
    var Strings;
    (function (Strings) {
        "use strict";
        function left(str, length) {
            Validation.ensureNumberInRange(length, 0);
            if (str === null || str === undefined) {
                return str;
            }
            if (str.length <= length) {
                return str;
            }
            return str.substr(0, length);
        }
        Strings.left = left;
        function right(str, length) {
            Validation.ensureNumberInRange(length, 0);
            if (str === null || str === undefined) {
                return str;
            }
            if (str.length <= length) {
                return str;
            }
            return str.substr(str.length - length, length);
        }
        Strings.right = right;
    })(Strings = Validation.Strings || (Validation.Strings = {}));
})(Validation || (Validation = {}));

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
                        .then(function (entityType, id, name) {
                        resolve({
                            type: entityType,
                            id: id,
                            name: name
                        });
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
                        .then(function (entityType, id) {
                        resolve({
                            type: entityType,
                            id: id
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
                        .then(function (entityType, id) {
                        resolve({
                            type: entityType,
                            id: id
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
                "SchemaName"
            ];
            function entityDefinitions(attributes) {
                if (attributes === void 0) { attributes = entityDefinitionAttributes; }
                var query = "?$select=" + attributes.join(",");
                return new Promise(function (resolve, reject) {
                    Xrm.WebApi.retrieveMultipleRecords("EntityDefinition", query, 500)
                        .then(function (response) {
                        resolve(response.entities);
                    }, function (error) {
                        console.error(error);
                        reject(error);
                    });
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
                    return data ? data.Options : [];
                });
            }
            OData.entityAttributeOptionSetDefinition = entityAttributeOptionSetDefinition;
        })(OData = Crm.OData || (Crm.OData = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Config;
    (function (Config) {
        "use strict";
        window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
            "entitydefinition": "EntityDefinitions"
        });
        Config.moduleName = "metadata-browser";
        function init() {
            angular.bootstrap(document, [
                Config.moduleName
            ]);
        }
        angular.module(Config.moduleName, [
            "ngMaterial",
            "ngMessages"
        ]);
        angular.element(document)
            .ready(init);
    })(Config = MetadataBrower.Config || (MetadataBrower.Config = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        var NavigationService = (function () {
            function NavigationService() {
                this.EntityTabs = [];
            }
            NavigationService.prototype.AddEntityTab = function (entity) {
                var filtered = this.EntityTabs
                    .filter(function (x) { return x.entity.LogicalName === entity.LogicalName; });
                if (filtered.length > 0) {
                    this.SelectedIndex = this.EntityTabs.indexOf(filtered[0]) + 1;
                }
                else {
                    this.EntityTabs.push({
                        entity: entity,
                        title: entity.SchemaName
                    });
                    this.SelectedIndex = this.EntityTabs.length;
                }
            };
            NavigationService.prototype.DeleteEntityTab = function (tab) {
                _.remove(this.EntityTabs, function (t) { return t.entity.LogicalName === tab.entity.LogicalName; });
            };
            return NavigationService;
        }());
        function NavigationServiceFactory() {
            return new NavigationService();
        }
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.navigationService", [NavigationServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        var ODataService = (function () {
            function ODataService($q) {
                this._$q = $q;
            }
            ODataService.prototype.GetEntities = function () {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityDefinitions()
                    .then(function (array) {
                    defer.resolve(array);
                })
                    .catch(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            ODataService.prototype.GetAttributes = function (entityDefinition) {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributesDefinition(entityDefinition.MetadataId)
                    .then(function (array) {
                    defer.resolve(array);
                })
                    .fail(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            ODataService.prototype.GetOptionSets = function (entityDefinition, attributeDefinition) {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributeOptionSetDefinition(entityDefinition.MetadataId, attributeDefinition.MetadataId)
                    .done(function (array) {
                    defer.resolve(array);
                })
                    .fail(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            return ODataService;
        }());
        function DataServiceFactory($q) {
            return new ODataService($q);
        }
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Controller;
    (function (Controller) {
        "use strict";
        function entityDetailsFactory() {
            return {
                controller: EntityDetails,
                restrict: "E",
                scope: {
                    entity: "="
                },
                templateUrl: "templates/entity_details.html"
            };
        }
        var EntityDetails = (function () {
            function EntityDetails(scope, dataService) {
                this._dataService = dataService;
                scope.vm = {
                    advancedView: false,
                    attributes: [],
                    currentPage: 1,
                    entity: scope.entity,
                    entityAttributes: [],
                    isBusy: false,
                    filter: "",
                    pageSize: 20,
                    total: 0
                };
                scope.clear = this.clear.bind(this);
                scope.search = this.search.bind(this);
                scope.export = this.export.bind(this);
                this.vm = scope.vm;
                this.loadEntityMetadata();
                scope.$watch("vm.currentPage", this.filterAttributes.bind(this));
            }
            EntityDetails.prototype.clear = function () {
                this.vm.currentPage = 1;
                this.vm.filter = "";
                this.showAttributes();
            };
            EntityDetails.prototype.export = function () {
                console.warn("Not implemented");
            };
            EntityDetails.prototype.filterAttributes = function () {
                var filter = this.vm.filter;
                var attributes = this.vm.entityAttributes.filter(function (att) {
                    return att.LogicalName.indexOf(filter) >= 0;
                });
                this.showAttributes(attributes);
            };
            EntityDetails.prototype.loadEntityMetadata = function () {
                var _this = this;
                this.vm.isBusy = true;
                return this._dataService
                    .GetAttributes(this.vm.entity)
                    .then(function (array) {
                    _this.vm.entityAttributes = array.sort(function (a1, a2) {
                        if (a1.LogicalName < a2.LogicalName) {
                            return -1;
                        }
                        if (a1.LogicalName > a2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showAttributes();
                    return _this.vm.entityAttributes;
                })
                    .finally(this.loadEntityMetadataCompleted.bind(this));
            };
            EntityDetails.prototype.loadEntityMetadataCompleted = function () {
                this.vm.isBusy = false;
            };
            EntityDetails.prototype.search = function () {
                this.vm.currentPage = 1;
                this.filterAttributes();
            };
            EntityDetails.prototype.showAttributes = function (attributes) {
                attributes = attributes || this.vm.entityAttributes;
                var pageSize = this.vm.pageSize;
                var skip = (this.vm.currentPage - 1) * pageSize;
                this.vm.total = attributes.length;
                this.vm.attributes = attributes
                    .filter(function (a, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityDetails.$inject = ["$scope", "metadataBrowser.core.dataService"];
            return EntityDetails;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("entityDetails", entityDetailsFactory);
    })(Controller = MetadataBrower.Controller || (MetadataBrower.Controller = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function pagerFactory() {
            return {
                controller: PagerController,
                restrict: "E",
                scope: {
                    currentPage: '=',
                    pageSize: '=',
                    total: '='
                },
                template: "<span class=\"pager\">\n    <span ng-bind=\"currentPage\"></span> of <span ng-bind=\"pages\"></span>\n    <md-button ng-click=\"prev()\">Prev</md-button>\n    <md-button ng-click=\"next()\">Next</md-button>\n</span>"
            };
        }
        var PagerController = (function () {
            function PagerController(scope) {
                this._scope = scope;
                this._scope.$watch("total", this.updatePages.bind(this));
                this._scope.$watch("pageSize", this.updatePages.bind(this));
                this._scope.next = this.next.bind(this);
                this._scope.prev = this.prev.bind(this);
            }
            PagerController.prototype.updatePages = function () {
                if (this._scope.pageSize === 0) {
                    this._scope.pageSize = 10;
                }
                this._scope.pages = Math.ceil(this._scope.total / this._scope.pageSize);
            };
            PagerController.prototype.next = function () {
                if (this._scope.currentPage >= this._scope.pages) {
                    return;
                }
                this._scope.currentPage++;
            };
            PagerController.prototype.prev = function () {
                if (this._scope.currentPage <= 1) {
                    return;
                }
                this._scope.currentPage--;
            };
            PagerController.$inject = ["$scope"];
            return PagerController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("pager", pagerFactory);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function picklistFactory() {
            return {
                controller: PicklistController,
                restrict: "E",
                scope: {
                    entity: "=",
                    attribute: "="
                },
                template: "\n<a href=\"javascript:void(0);\" class=\"picklist-toggle\" ng-click=\"load()\">+\n    <md-tooltip md-direction=\"right\" class=\"picklist\">\n        <span ng-if=\"!options\">Click to load options</span>\n        <span ng-if=\"options && !options.length\">Loading...</span>\n        <ul class=\"options\" ng-if=\"options && options.length\">\n            <li class=\"option\" ng-repeat=\"option in options\">\n                <span ng-bind=\"option.Label.UserLocalizedLabel.Label\"></span>\n                <span ng-if=\"option.Value !== null\">&nbsp;=&nbsp;</span>\n                <span ng-bind=\"option.Value\"></span>\n            </li>\n        </ul>\n    </md-tooltip>\n</a>"
            };
        }
        var PicklistController = (function () {
            function PicklistController(scope, dataService) {
                scope.load = function () {
                    if (scope.options) {
                        return;
                    }
                    scope.options = [];
                    dataService
                        .GetOptionSets(scope.entity, scope.attribute)
                        .then(function (optionSets) {
                        scope.options = optionSets;
                        if (!scope.options.length) {
                            scope.options.push({
                                Label: {
                                    UserLocalizedLabel: {
                                        Label: "No values"
                                    }
                                },
                                Value: null
                            });
                        }
                    })
                        .catch(function () {
                        scope.options = null;
                    });
                };
            }
            PicklistController.$inject = ["$scope", "metadataBrowser.core.dataService"];
            return PicklistController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("picklist", picklistFactory);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function propertyBrowser() {
            return {
                restrict: "E",
                scope: {
                    object: "="
                },
                templateUrl: "templates/property_browser.html"
            };
        }
        angular.module(MetadataBrower.Config.moduleName)
            .directive("propertyBrowser", propertyBrowser);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var EntityListController = (function () {
            function EntityListController($scope, navigationService, dataService) {
                this.advancedView = false;
                this.currentPage = 1;
                this.entities = [];
                this.entitiesToShow = [];
                this.filter = "";
                this.isBusy = false;
                this.pageSize = 20;
                this.total = 0;
                this.navigationService = navigationService;
                this.dataService = dataService;
                $scope.$watch("vm.currentPage", this.filterEntities.bind(this));
                this.loadEntities();
            }
            EntityListController.prototype.clear = function () {
                this.currentPage = 1;
                this.filter = "";
                this.showEntities();
            };
            EntityListController.prototype.exportToCsv = function () {
                console.warn("Not implemented");
            };
            EntityListController.prototype.filterEntities = function () {
                var filter = this.filter;
                var entities = this.entities.filter(function (e) {
                    return e.LogicalName.indexOf(filter) >= 0;
                });
                this.showEntities(entities);
            };
            EntityListController.prototype.loadEntities = function () {
                var _this = this;
                this.currentPage = 1;
                this.entities = [];
                this.entitiesToShow = [];
                this.filter = "";
                this.total = 0;
                this.isBusy = true;
                this.dataService.GetEntities()
                    .then(function (data) {
                    _this.entities = data.sort(function (e1, e2) {
                        if (e1.LogicalName < e2.LogicalName) {
                            return -1;
                        }
                        if (e1.LogicalName > e2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showEntities();
                })
                    .finally(this.loadEntitiesCompleted.bind(this));
            };
            EntityListController.prototype.loadEntitiesCompleted = function () {
                this.isBusy = false;
            };
            EntityListController.prototype.showEntities = function (entities) {
                entities = entities || this.entities;
                var pageSize = this.pageSize;
                var skip = (this.currentPage - 1) * pageSize;
                this.total = entities.length;
                this.entitiesToShow = entities
                    .filter(function (e, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityListController.prototype.openEntity = function (entity) {
                this.navigationService.AddEntityTab(entity);
            };
            EntityListController.prototype.search = function () {
                this.currentPage = 1;
                this.filterEntities();
            };
            EntityListController.$inject = ["$scope", "metadataBrowser.core.navigationService", "metadataBrowser.core.dataService"];
            return EntityListController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.entityList", EntityListController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MetadataBrowserController = (function () {
            function MetadataBrowserController(navigationService) {
                var vm = this;
                vm.navigationService = navigationService;
            }
            MetadataBrowserController.$inject = ["metadataBrowser.core.navigationService"];
            return MetadataBrowserController;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.crmMetadataBrowser", MetadataBrowserController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));