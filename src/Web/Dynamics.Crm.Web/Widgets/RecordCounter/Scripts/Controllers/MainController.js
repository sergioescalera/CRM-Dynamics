var RecordCounter;
(function (RecordCounter) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        function executeInBatch(q, array, task, start = 0, size = 3, continueOnError = true) {
            if (start >= array.length) {
                return q.resolve();
            }
            let batch = array.slice(start, start + size);
            let tasks = batch.map(o => task(o));
            let defer = q.defer();
            let next = () => {
                executeInBatch(q, array, task, start + size, size)
                    .then(() => {
                    defer.resolve();
                })
                    .catch((reason) => {
                    if (continueOnError) {
                        defer.resolve();
                    }
                    else {
                        defer.reject(reason);
                    }
                });
            };
            q.all(tasks)
                .then(() => {
                next();
            })
                .catch((reason) => {
                if (continueOnError) {
                    next();
                }
                else {
                    defer.reject(reason);
                }
            });
            return defer.promise;
        }
        function toCsv(e, c) {
            return `${e.LogicalName},${c.value},${(c.error || "")}`;
        }
        let chart;
        class MainController {
            constructor(scope, q, http, dataService) {
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
            refresh() {
                this.loadEntities()
                    .then(() => {
                    this.count()
                        .then(() => {
                        this.updateChart();
                    });
                });
            }
            search() {
                this.currentPage = 1;
                this.filterEntities();
            }
            clear() {
                this.currentPage = 1;
                this.filter = "";
                this.compareValue = null;
                this.showEntities();
            }
            exportCsv() {
                let blob = new Blob([
                    `Entity Name,Record Count,Error
${this.data.map(e => toCsv(e, this.counter[e.LogicalName])).join("\n")}`
                ], {
                    type: "text/csv"
                });
                let url = URL.createObjectURL(blob);
                let filename = "record_counter.csv";
                let download = document.getElementById("download");
                download.href = url;
                download.download = filename;
                download.click();
            }
            count() {
                this.isBusy = true;
                return executeInBatch(this._q, this.data, (entity) => {
                    let counter = {};
                    this.counter[entity.LogicalName] = counter;
                    if (entity.ExternalName) {
                        counter.error = "Unable to count virtual entity";
                        return this._q.resolve();
                    }
                    else {
                        counter.busy = true;
                        let defer = this._q.defer();
                        this.fetchAggregateCount(entity)
                            .then(response => {
                            try {
                                counter.busy = false;
                                counter.value = response.data.value[0].count;
                            }
                            catch (e) {
                                counter.error = "Unable to retrieve count";
                                console.warn(e);
                            }
                            defer.resolve();
                        })
                            .catch(response => {
                            try {
                                let message = response.data.error.message;
                                if (message.indexOf("AggregateQueryRecordLimit") >= 0) {
                                    this.fetchAll(entity)
                                        .then(() => {
                                        counter.busy = false;
                                        defer.resolve();
                                    })
                                        .catch(() => {
                                        counter.busy = false;
                                        defer.resolve();
                                    });
                                }
                                else {
                                    counter.busy = false;
                                    counter.error = message;
                                    defer.resolve();
                                }
                            }
                            catch (e) {
                                counter.error = "Something went wrong";
                                console.warn(e);
                                defer.resolve();
                            }
                        });
                        return defer.promise;
                    }
                }, 0, 10)
                    .finally(() => {
                    this.isBusy = false;
                });
            }
            fetchAggregateCount(entity) {
                let fetch = `
<fetch aggregate="true">
    <entity name="${entity.LogicalName}">
        <attribute name="${entity.PrimaryIdAttribute}" aggregate="count" alias="count" />
    </entity>
</fetch>`;
                let url = `${Xrm.Utility.getGlobalContext().getClientUrl()}/api/data/v9.0/${entity.EntitySetName}?fetchXml=${encodeURIComponent(fetch)}`;
                return this._http.get(url);
            }
            fetchAll(entity) {
                let counter = this.counter[entity.LogicalName];
                let defer = this._q.defer();
                let url = `${Xrm.Utility.getGlobalContext().getClientUrl()}/api/data/v9.0/${entity.EntitySetName}?$select=${entity.PrimaryIdAttribute}&$count=true`;
                this._http.get(url, {
                    headers: {
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0",
                        "Prefer": "odata.maxpagesize=5000"
                    }
                })
                    .then(response => {
                    let next = response.data["@odata.nextLink"];
                    let count = response.data["@odata.count"];
                    counter.value = count;
                    if (next) {
                        this.fetchNext(entity, counter, next)
                            .then(() => {
                            defer.resolve();
                        });
                    }
                    else {
                        defer.resolve();
                    }
                })
                    .catch(() => {
                    counter.error = "Unable to retrieve all records";
                    defer.resolve();
                });
                return defer.promise;
            }
            fetchNext(entity, counter, url) {
                let defer = this._q.defer();
                this._http.get(url, {
                    headers: {
                        "OData-MaxVersion": "4.0",
                        "OData-Version": "4.0"
                    }
                })
                    .then(response => {
                    let next = response.data["@odata.nextLink"];
                    if (next) {
                        counter.value += response.data["@odata.count"];
                        this.fetchNext(entity, counter, next)
                            .then(() => {
                            defer.resolve();
                        });
                    }
                    else {
                        defer.resolve();
                        counter.value += response.data.value.length;
                    }
                })
                    .catch(response => {
                    defer.resolve();
                });
                return defer.promise;
            }
            filterEntities() {
                let filter = this.filter;
                let compare = this.compareValue;
                let entities = this.data.filter((e) => {
                    let value = true;
                    if (filter && e.LogicalName.indexOf(filter) < 0) {
                        value = false;
                    }
                    let counter = this.counter[e.LogicalName] || {};
                    if (compare && (!counter.value || counter.value < compare)) {
                        value = false;
                    }
                    return value;
                });
                this.showEntities(entities);
            }
            loadEntities() {
                this.currentPage = 1;
                this.data = [];
                this.entities = [];
                this.filter = "";
                this.total = 0;
                this.isBusy = true;
                return this._dataService.GetEntities()
                    .then((data) => {
                    this.data = data.sort((e1, e2) => {
                        if (e1.LogicalName < e2.LogicalName) {
                            return -1;
                        }
                        if (e1.LogicalName > e2.LogicalName) {
                            return 1;
                        }
                        return 0;
                    });
                    this.showEntities();
                })
                    .finally(() => {
                    this.isBusy = false;
                });
            }
            showEntities(entities) {
                entities = entities || this.data;
                let pageSize = this.pageSize;
                let skip = (this.currentPage - 1) * pageSize;
                this.total = entities.length;
                this.entities = entities
                    .filter((e, index) => index >= skip && index < skip + pageSize);
            }
            updateChart(top = 10) {
                let entities = this.data
                    .sort((e1, e2) => {
                    let c1 = (this.counter[e1.LogicalName] || {}).value || 0;
                    let c2 = (this.counter[e2.LogicalName] || {}).value || 0;
                    return c2 - c1;
                })
                    .filter((e1, index) => {
                    return index < top;
                });
                let labels = entities.map(e => e.LogicalName);
                let data = entities.map(e => this.counter[e.LogicalName].value || 0);
                let dataset = {
                    label: "Top Entities",
                    data: data,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(200, 99, 132, 0.2)",
                        "rgba(200, 199, 132, 0.2)",
                        "rgba(255, 50, 102, 0.2)",
                        "rgba(200, 99, 232, 0.2)"
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
                        },
                        options: {
                            responsive: false,
                            maintainAspectRatio: true
                        }
                    });
                }
            }
        }
        MainController.$inject = [
            "$scope",
            "$q",
            "$http",
            "metadataBrowser.core.dataService"
        ];
        angular.module(RecordCounter.Config.moduleName)
            .controller("recordCounter.ui.controllers.mainController", MainController);
    })(Controllers = RecordCounter.Controllers || (RecordCounter.Controllers = {}));
})(RecordCounter || (RecordCounter = {}));
