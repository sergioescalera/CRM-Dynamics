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

var MetadataBrower;
(function (MetadataBrower) {
    var Config;
    (function (Config) {
        "use strict";
        Config.moduleName = "metadata-browser";
        angular.module(Config.moduleName, [
            "ui.bootstrap"
        ]);
    })(Config = MetadataBrower.Config || (MetadataBrower.Config = {}));
})(MetadataBrower || (MetadataBrower = {}));

var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
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
                    .done(function (array) {
                    defer.resolve(array);
                })
                    .fail(function () {
                    defer.reject();
                });
                return defer.promise;
            };
            ODataService.prototype.GetAttributes = function (entityDefinition) {
                var defer = this._$q.defer();
                Dynamics.Crm.OData
                    .entityAttributesDefinition(entityDefinition.MetadataId)
                    .done(function (array) {
                    debugger;
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
            // return new DataService($q);
            return new ODataService($q);
        }
        angular.module(MetadataBrower.Config.moduleName)
            .factory("metadataBrowser.core.dataService", ["$q", DataServiceFactory]);
    })(Core = MetadataBrower.Core || (MetadataBrower.Core = {}));
})(MetadataBrower || (MetadataBrower = {}));
var MetadataBrower;
(function (MetadataBrower) {
    var Core;
    (function (Core) {
        "use strict";
        var NavigationService = (function () {
            function NavigationService() {
                this.EntityTabs = new Array();
            }
            NavigationService.prototype.AddEntityTab = function (entity) {
                var filter = this.EntityTabs.filter(function (x) { return x.entity.LogicalName === entity.LogicalName; });
                if (!!filter.length) {
                    filter[0].active = true;
                }
                else {
                    this.EntityTabs.push({
                        active: true,
                        entity: entity,
                        title: entity.SchemaName
                    });
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
                    .then((function (data) {
                    _this.entities = data.sort(function (e1, e2) {
                        if (e1.SchemaName < e2.SchemaName) {
                            return -1;
                        }
                        if (e1.SchemaName > e2.SchemaName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showEntities();
                })
                    .bind(this))
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
    var Controller;
    (function (Controller) {
        "use strict";
        function entityDetailsFactory() {
            return {
                controller: EntityDetails,
                restrict: "A",
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
                debugger;
                return this._dataService.GetAttributes(this.vm.entity)
                    .then((function (array) {
                    debugger;
                    _this.vm.entityAttributes = array.sort(function (a1, a2) {
                        if (a1.SchemaName < a2.SchemaName) {
                            return -1;
                        }
                        if (a1.SchemaName > a2.SchemaName) {
                            return 1;
                        }
                        return 0;
                    });
                    _this.showAttributes();
                })
                    .bind(this))
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
                this.vm.attributes = attributes.filter(function (a, index) { return index >= skip && index < skip + pageSize; });
            };
            EntityDetails.$inject = ["$scope", "metadataBrowser.core.dataService"];
            return EntityDetails;
        }());
        angular.module(MetadataBrower.Config.moduleName)
            .directive("tsEntityDetails", entityDetailsFactory);
    })(Controller = MetadataBrower.Controller || (MetadataBrower.Controller = {}));
})(MetadataBrower || (MetadataBrower = {}));
var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function propertyBrowser() {
            return {
                restrict: "A",
                scope: {
                    object: "="
                },
                templateUrl: "templates/property_browser.html"
            };
        }
        angular.module(MetadataBrower.Config.moduleName)
            .directive("tsPropertyBrowser", propertyBrowser);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));