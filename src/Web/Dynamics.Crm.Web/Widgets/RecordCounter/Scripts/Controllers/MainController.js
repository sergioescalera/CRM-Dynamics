var RecordCounter;
(function (RecordCounter) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function executeInBatch(q, array, task, start, size, continueOnError) {
            if (start === void 0) { start = 0; }
            if (size === void 0) { size = 3; }
            if (continueOnError === void 0) { continueOnError = true; }
            if (start >= array.length) {
                return q.resolve();
            }
            var batch = array.slice(start, start + size);
            var tasks = batch.map(function (o) { return task(o); });
            var defer = q.defer();
            var next = function () {
                executeInBatch(q, array, task, start + size, size)
                    .then(function () {
                    defer.resolve();
                })
                    .catch(function (reason) {
                    if (continueOnError) {
                        defer.resolve();
                    }
                    else {
                        defer.reject(reason);
                    }
                });
            };
            q.all(tasks)
                .then(function () {
                next();
            })
                .catch(function (reason) {
                if (continueOnError) {
                    next();
                }
                else {
                    defer.reject(reason);
                }
            });
            return defer.promise;
        }
        var MainController = /** @class */ (function () {
            function MainController(scope, q, http, dataService) {
                this._q = q;
                this._http = http;
                this._dataService = dataService;
                this.counter = {};
                this.currentPage = 1;
                this.data = [];
                this.entities = [];
                this.filter = "";
                this.isBusy = false;
                this.pageSize = 20;
                this.total = 0;
                scope.$watch("vm.currentPage", this.filterEntities.bind(this));
                this.loadEntities();
            }
            MainController.prototype.search = function () {
                this.currentPage = 1;
                this.filterEntities();
            };
            MainController.prototype.clear = function () {
                this.currentPage = 1;
                this.filter = "";
                this.showEntities();
            };
            MainController.prototype.process = function () {
                var _this = this;
                this.isBusy = true;
                executeInBatch(this._q, this.data, function (entity) {
                    var fetch = "<fetch aggregate=\"true\">\n<entity name=\"" + entity.LogicalName + "\">\n    <attribute name=\"" + entity.PrimaryIdAttribute + "\" aggregate=\"count\" alias=\"count\" />\n</entity>\n</fetch>";
                    var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/" + entity.EntitySetName + "?fetchXml=" + encodeURIComponent(fetch);
                    _this.counter[entity.LogicalName] = "Counting...";
                    return _this._http.get(url)
                        .then(function (response) {
                        try {
                            _this.counter[entity.LogicalName] = response.data.value[0].count;
                        }
                        catch (e) {
                            _this.counter[entity.LogicalName] = null;
                            console.warn(e);
                        }
                    })
                        .catch(function (response) {
                        try {
                            _this.counter[entity.LogicalName] = response.data.error.message;
                        }
                        catch (e) {
                            _this.counter[entity.LogicalName] = "Something went wrong";
                            console.warn(e);
                        }
                    });
                }, 0, 10)
                    .finally(function () {
                    _this.isBusy = false;
                });
            };
            MainController.prototype.exportToCsv = function () {
                console.warn("Not implemented");
            };
            MainController.prototype.filterEntities = function () {
                var filter = this.filter;
                var entities = this.data.filter(function (e) {
                    return e.LogicalName.indexOf(filter) >= 0;
                });
                this.showEntities(entities);
            };
            MainController.prototype.loadEntities = function () {
                var _this = this;
                this.currentPage = 1;
                this.data = [];
                this.entities = [];
                this.filter = "";
                this.total = 0;
                this.isBusy = true;
                this._dataService.GetEntities()
                    .then(function (data) {
                    _this.data = data.sort(function (e1, e2) {
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
                    .finally(function () {
                    _this.isBusy = false;
                });
            };
            MainController.prototype.showEntities = function (entities) {
                entities = entities || this.data;
                var pageSize = this.pageSize;
                var skip = (this.currentPage - 1) * pageSize;
                this.total = entities.length;
                this.entities = entities
                    .filter(function (e, index) { return index >= skip && index < skip + pageSize; });
            };
            MainController.$inject = [
                "$scope",
                "$q",
                "$http",
                "metadataBrowser.core.dataService"
            ];
            return MainController;
        }());
        angular.module(RecordCounter.Config.moduleName)
            .controller("recordCounter.ui.controllers.mainController", MainController);
    })(Controllers = RecordCounter.Controllers || (RecordCounter.Controllers = {}));
})(RecordCounter || (RecordCounter = {}));
