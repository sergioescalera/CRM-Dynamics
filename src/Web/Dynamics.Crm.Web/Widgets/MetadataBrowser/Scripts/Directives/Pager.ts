module MetadataBrower.Controllers {

    "use strict";

    function pagerFactory(): ng.IDirective {

        return {
            controller: PagerController,
            restrict: "E",
            scope: {
                currentPage: '=',
                pageSize: '=',
                total: '='
            },
            template: `<span class="pager">
    <span ng-bind="currentPage"></span> of <span ng-bind="pages"></span>
    <md-button ng-click="prev()">Prev</md-button>
    <md-button ng-click="next()">Next</md-button>
</span>`
        };
    }

    interface IPagerScope extends ng.IScope {
        currentPage: number,
        pages: number,
        pageSize: number,
        total: number,

        next(): void;
        prev(): void;
    }

    class PagerController {

        static $inject = ["$scope"];

        private _scope: IPagerScope;

        constructor(scope: IPagerScope) {

            this._scope = scope;

            this._scope.$watch("total", this.updatePages.bind(this));
            this._scope.$watch("pageSize", this.updatePages.bind(this));
            this._scope.next = this.next.bind(this);
            this._scope.prev = this.prev.bind(this);
        }

        updatePages(): void {
            if (this._scope.pageSize === 0) {
                this._scope.pageSize = 10;
            }            
            this._scope.pages = Math.ceil(this._scope.total / this._scope.pageSize);
        }

        next(): void {
            if (this._scope.currentPage >= this._scope.pages) {
                return;
            }
            this._scope.currentPage++;
        }

        prev(): void {
            if (this._scope.currentPage <= 1) {
                return;
            }
            this._scope.currentPage--;
        }
    }

    export var pager: string = "pager";

    angular.module(pager, [])
        .directive(pager, pagerFactory);
}