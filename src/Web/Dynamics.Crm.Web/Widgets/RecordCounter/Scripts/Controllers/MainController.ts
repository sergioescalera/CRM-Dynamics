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

        counter: _.Dictionary<string>;
        currentPage: number;
        data: IEntityDefinition[];
        entities: IEntityDefinition[];
        filter: string;
        isBusy: boolean;
        pageSize: number;
        total: number;

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

            scope.$watch("vm.currentPage", this.filterEntities.bind(this));

            this.loadEntities();
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

        process(): void {

            this.isBusy = true;

            executeInBatch(this._q, this.data, (entity) => {

                let fetch = `<fetch aggregate="true">
<entity name="${entity.LogicalName}">
    <attribute name="${entity.PrimaryIdAttribute}" aggregate="count" alias="count" />
</entity>
</fetch>`;

                let url = `${Xrm.Utility.getGlobalContext().getClientUrl()}/api/data/v9.0/${entity.EntitySetName}?fetchXml=${encodeURIComponent(fetch)}`;

                this.counter[entity.LogicalName] = "Counting...";

                return this._http.get<any>(url)
                    .then(response => {

                        try {
                            this.counter[entity.LogicalName] = response.data.value[0].count;
                        } catch (e) {
                            this.counter[entity.LogicalName] = null;
                            console.warn(e);
                        }
                    })
                    .catch(response => {

                        try {
                            this.counter[entity.LogicalName] = response.data.error.message
                        } catch (e) {
                            this.counter[entity.LogicalName] = "Something went wrong";
                            console.warn(e);
                        }
                    });

            }, 0, 10)
                .finally(() => {

                    this.isBusy = false;
                });
        }

        exportToCsv(): void {

            console.warn("Not implemented");
        }

        private filterEntities(): void {

            let filter: string = this.filter;

            let entities: IEntityDefinition[] = this.data.filter((e: IEntityDefinition) => {

                return e.LogicalName.indexOf(filter) >= 0;
            });

            this.showEntities(entities);
        }

        private loadEntities(): void {

            this.currentPage = 1;
            this.data = [];
            this.entities = [];
            this.filter = "";
            this.total = 0;
            this.isBusy = true;

            this._dataService.GetEntities()
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
    }

    angular.module(Config.moduleName)
        .controller("recordCounter.ui.controllers.mainController", MainController);
}