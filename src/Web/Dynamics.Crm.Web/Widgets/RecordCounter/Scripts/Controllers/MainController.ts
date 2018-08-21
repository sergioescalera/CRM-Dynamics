declare var Chart: any;

module RecordCounter.Controllers {

    "use strict";

    function executeInBatch<T>(
        q: ng.IQService,
        array: T[],
        task: (o: T) => ng.IPromise<any>,
        start: number = 0,
        size: number = 3,
        continueOnError: boolean = true): ng.IPromise<any> {

        if (start >= array.length) {
            return q.resolve();
        }

        let batch: any[] = array.slice(start, start + size);

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
                    } else {
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
                } else {
                    defer.reject(reason);
                }
            });

        return defer.promise;
    }

    interface Counter {
        value?: number;
        error?: string;
        busy?: boolean;
    }

    let chart: any;
    
    class MainController {

        static $inject = [
            "$scope",
            "$q",
            "$http",
            "metadataBrowser.core.dataService"
        ];

        private _q: ng.IQService;
        private _http: ng.IHttpService;
        private _dataService: MetadataBrower.Core.IDataService;

        counter: _.Dictionary<Counter>;
        currentPage: number;
        data: IEntityDefinition[];
        entities: IEntityDefinition[];
        isBusy: boolean;
        pageSize: number;
        total: number;

        filter: string;
        operator: ">=";
        compareValue: number;

        constructor(
            scope: ng.IScope,
            q: ng.IQService,
            http: ng.IHttpService,
            dataService: MetadataBrower.Core.IDataService) {

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

        refresh(): void {

            this.loadEntities()
                .then(() => {

                    this.count()
                        .then(() => {

                            this.updateChart();
                        });
                });
        }

        search(): void {

            this.currentPage = 1;

            this.filterEntities();
        }

        clear(): void {

            this.currentPage = 1;
            this.filter = "";

            this.showEntities();
        }

        exportToCsv(): void {

            console.warn("Not implemented");
        }

        private count(): ng.IPromise<any> {

            this.isBusy = true;

            return executeInBatch(this._q, this.data, (entity) => {

                if (entity.ExternalName) {

                    this.counter[entity.LogicalName] = {
                        error: "Unable to count virtual entity"
                    };
                    
                    return this._q.resolve();

                } else {

                    this.counter[entity.LogicalName] = {
                        busy: true
                    };

                    let defer = this._q.defer();

                    this.fetchAggregateCount(entity)
                        .then(response => {

                            try {
                                this.counter[entity.LogicalName].value = response.data.value[0].count;
                            } catch (e) {
                                this.counter[entity.LogicalName].error = "Unable to retrieve count";
                                console.warn(e);
                            }
                            defer.resolve();
                        })
                        .catch(response => {

                            try {
                                this.counter[entity.LogicalName].error = response.data.error.message
                            } catch (e) {
                                this.counter[entity.LogicalName].error = "Something went wrong";
                                console.warn(e);
                            }
                            defer.resolve();
                        })
                        .finally(() => {

                            this.counter[entity.LogicalName].busy = false;
                        });

                    return defer.promise;
                }

            }, 0, 10)
                .finally(() => {

                    this.isBusy = false;
                });
        }

        private fetchAggregateCount(entity: IEntityDefinition): ng.IHttpPromise<any> {

            let fetch = `<fetch aggregate="true">
<entity name="${entity.LogicalName}">
    <attribute name="${entity.PrimaryIdAttribute}" aggregate="count" alias="count" />
</entity>
</fetch>`;

            let url = `${Xrm.Utility.getGlobalContext().getClientUrl()}/api/data/v9.0/${entity.EntitySetName}?fetchXml=${encodeURIComponent(fetch)}`;

            return this._http.get<any>(url);
        }

        private filterEntities(): void {

            let filter: string = this.filter;
            let compare: number = this.compareValue;

            let entities: IEntityDefinition[] = this.data.filter((e: IEntityDefinition) => {

                let value: boolean = true;

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

        private loadEntities(): ng.IPromise<void> {

            this.currentPage = 1;
            this.data = [];
            this.entities = [];
            this.filter = "";
            this.total = 0;
            this.isBusy = true;

            return this._dataService.GetEntities()
                .then((data: IEntityDefinition[]) => {

                    this.data = data.sort((e1: IEntityDefinition, e2: IEntityDefinition) => {

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

        private showEntities(entities?: any[]): void {

            entities = entities || this.data;

            let pageSize: number = this.pageSize;
            let skip: number = (this.currentPage - 1) * pageSize;

            this.total = entities.length;
            this.entities = entities
                .filter((e: IEntityDefinition, index: number) => index >= skip && index < skip + pageSize);
        }

        private updateChart(top: number = 10): void {

            let entities = this.entities.sort((e1, e2) => {

                let c1 = (this.counter[e1.LogicalName] || {}).value || 0;
                let c2 = (this.counter[e2.LogicalName] || {}).value || 0;

                return c2 - c1;

            }).filter((e1, index) => {

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
                    "rgba(255, 99, 132, 0.2)"
                ],
                borderWidth: 1
            };

            if (chart) {

                chart.data.labels = labels;
                chart.data.datasets[0] = dataset;
                chart.update();

            } else {

                chart = new Chart("top-entities-chart", {
                    type: "pie",
                    data: {
                        labels: labels,
                        datasets: [dataset]
                    }
                });
            }
        }
    }

    angular.module(Config.moduleName)
        .controller("recordCounter.ui.controllers.mainController", MainController);
}