module MetadataBrower.Controllers {

    "use strict";

    class MetadataBrowserController {

        static $inject = ["metadataBrowser.core.navigationService"];

        navigationService: Core.INavigationService;

        constructor(navigationService: Core.INavigationService) {

            var vm: MetadataBrowserController = this;

            vm.navigationService = navigationService;
        }
    }

    angular.module(Config.moduleName)
        .controller("metadataBrowser.ui.controllers.crmMetadataBrowser", MetadataBrowserController);
}