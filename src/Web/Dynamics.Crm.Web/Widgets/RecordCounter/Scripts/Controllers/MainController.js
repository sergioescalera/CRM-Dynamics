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
        var chart;
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
                this.operator = ">=";
                this.compareValue = null;
                scope.$watch("vm.currentPage", this.filterEntities.bind(this));
                this.refresh();
            }
            MainController.prototype.refresh = function () {
                var _this = this;
                this.loadEntities()
                    .then(function () {
                    _this.count()
                        .then(function () {
                        _this.updateChart();
                    });
                });
            };
            MainController.prototype.search = function () {
                this.currentPage = 1;
                this.filterEntities();
            };
            MainController.prototype.clear = function () {
                this.currentPage = 1;
                this.filter = "";
                this.showEntities();
            };
            MainController.prototype.exportToCsv = function () {
                console.warn("Not implemented");
            };
            MainController.prototype.count = function () {
                var _this = this;
                this.isBusy = true;
                return executeInBatch(this._q, this.data, function (entity) {
                    var counter = {};
                    _this.counter[entity.LogicalName] = counter;
                    if (entity.ExternalName) {
                        counter.error = "Unable to count virtual entity";
                        return _this._q.resolve();
                    }
                    else {
                        counter.busy = true;
                        var defer_1 = _this._q.defer();
                        _this.fetchAggregateCount(entity)
                            .then(function (response) {
                            try {
                                counter.busy = false;
                                counter.value = response.data.value[0].count;
                            }
                            catch (e) {
                                counter.error = "Unable to retrieve count";
                                console.warn(e);
                            }
                            defer_1.resolve();
                        })
                            .catch(function (response) {
                            try {
                                var message = response.data.error.message;
                                if (message.indexOf("AggregateQueryRecordLimit") >= 0) {
                                    _this.fetchAll(entity)
                                        .then(function () {
                                        counter.busy = false;
                                        defer_1.resolve();
                                    })
                                        .catch(function () {
                                        counter.busy = false;
                                        defer_1.resolve();
                                    });
                                }
                                else {
                                    counter.busy = false;
                                    counter.error = message;
                                    defer_1.resolve();
                                }
                            }
                            catch (e) {
                                counter.error = "Something went wrong";
                                console.warn(e);
                                defer_1.resolve();
                            }
                        });
                        return defer_1.promise;
                    }
                }, 0, 10)
                    .finally(function () {
                    _this.isBusy = false;
                });
            };
            MainController.prototype.fetchAggregateCount = function (entity) {
                var fetch = "\n<fetch aggregate=\"true\">\n    <entity name=\"" + entity.LogicalName + "\">\n        <attribute name=\"" + entity.PrimaryIdAttribute + "\" aggregate=\"count\" alias=\"count\" />\n    </entity>\n</fetch>";
                var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/" + entity.EntitySetName + "?fetchXml=" + encodeURIComponent(fetch);
                return this._http.get(url);
            };
            MainController.prototype.fetchAll = function (entity) {
                var _this = this;
                var counter = this.counter[entity.LogicalName];
                var defer = this._q.defer();
                var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/" + entity.EntitySetName + "?$select=" + entity.PrimaryIdAttribute + "&$count=true";
                this._http.get(url, {
                    headers: {
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0",
                        "Prefer": "odata.maxpagesize=5000"
                    }
                })
                    .then(function (response) {
                    var next = response.data["@odata.nextLink"];
                    var count = response.data["@odata.count"];
                    counter.value = count;
                    if (next) {
                        _this.fetchNext(entity, counter, next)
                            .then(function () {
                            defer.resolve();
                        });
                    }
                    else {
                        defer.resolve();
                    }
                })
                    .catch(function () {
                    counter.error = "Unable to retrieve all records";
                    defer.resolve();
                });
                return defer.promise;
            };
            MainController.prototype.fetchNext = function (entity, counter, url) {
                var _this = this;
                var defer = this._q.defer();
                this._http.get(url, {
                    headers: {
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0"
                    }
                })
                    .then(function (response) {
                    var next = response.data["@odata.nextLink"];
                    if (next) {
                        counter.value += response.data["@odata.count"];
                        _this.fetchNext(entity, counter, next)
                            .then(function () {
                            defer.resolve();
                        });
                    }
                    else {
                        defer.resolve();
                        counter.value += response.data.value.length;
                    }
                })
                    .catch(function (response) {
                    defer.resolve();
                });
                return defer.promise;
            };
            MainController.prototype.filterEntities = function () {
                var _this = this;
                var filter = this.filter;
                var compare = this.compareValue;
                var entities = this.data.filter(function (e) {
                    var value = true;
                    if (filter && e.LogicalName.indexOf(filter) < 0) {
                        value = false;
                    }
                    var counter = _this.counter[e.LogicalName] || {};
                    if (compare && (!counter.value || counter.value < compare)) {
                        value = false;
                    }
                    return value;
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
                return this._dataService.GetEntities()
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
            MainController.prototype.updateChart = function (top) {
                var _this = this;
                if (top === void 0) { top = 10; }
                var entities = this.entities.sort(function (e1, e2) {
                    var c1 = (_this.counter[e1.LogicalName] || {}).value || 0;
                    var c2 = (_this.counter[e2.LogicalName] || {}).value || 0;
                    return c2 - c1;
                }).filter(function (e1, index) {
                    return index < top;
                });
                var labels = entities.map(function (e) { return e.LogicalName; });
                var data = entities.map(function (e) { return _this.counter[e.LogicalName].value || 0; });
                var dataset = {
                    label: "Top Entities",
                    data: data,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(255, 99, 132, 0.2)"
                    ],
                    borderWidth: 1
                };
                if (chart) {
                    chart.data.labels = labels;
                    chart.data.datasets[0] = dataset;
                    chart.update();
                }
                else {
                    chart = new Chart("top-entities-chart", {
                        type: "pie",
                        data: {
                            labels: labels,
                            datasets: [dataset]
                        }
                    });
                }
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
