var MetadataBrower;
(function (MetadataBrower) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        class MetadataBrowserController {
            constructor(navigationService) {
                var vm = this;
                vm.navigationService = navigationService;
            }
        }
        MetadataBrowserController.$inject = ["metadataBrowser.core.navigationService"];
        angular.module(MetadataBrower.Config.moduleName)
            .controller("metadataBrowser.ui.controllers.crmMetadataBrowser", MetadataBrowserController);
    })(Controllers = MetadataBrower.Controllers || (MetadataBrower.Controllers = {}));
})(MetadataBrower || (MetadataBrower = {}));
