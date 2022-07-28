var Angular;
(function (Angular) {
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
                template: `<span class="pager">
    <span ng-bind="currentPage"></span> of <span ng-bind="pages"></span>
    <md-button ng-click="prev()">Prev</md-button>
    <md-button ng-click="next()">Next</md-button>
</span>`
            };
        }
        class PagerController {
            constructor(scope) {
                this._scope = scope;
                this._scope.$watch("total", this.updatePages.bind(this));
                this._scope.$watch("pageSize", this.updatePages.bind(this));
                this._scope.next = this.next.bind(this);
                this._scope.prev = this.prev.bind(this);
            }
            updatePages() {
                if (this._scope.pageSize === 0) {
                    this._scope.pageSize = 10;
                }
                this._scope.pages = Math.ceil(this._scope.total / this._scope.pageSize);
            }
            next() {
                if (this._scope.currentPage >= this._scope.pages) {
                    return;
                }
                this._scope.currentPage++;
            }
            prev() {
                if (this._scope.currentPage <= 1) {
                    return;
                }
                this._scope.currentPage--;
            }
        }
        PagerController.$inject = ["$scope"];
        Controllers.pager = "pager";
        angular.module(Controllers.pager, [])
            .directive(Controllers.pager, pagerFactory);
    })(Controllers = Angular.Controllers || (Angular.Controllers = {}));
})(Angular || (Angular = {}));
