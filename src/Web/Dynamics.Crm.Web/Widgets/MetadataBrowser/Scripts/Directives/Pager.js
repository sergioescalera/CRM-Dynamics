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
        var PagerController = /** @class */ (function () {
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
