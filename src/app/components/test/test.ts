class FancyButtonController {
    // ... see MyController above
}

angular.module('fbSomeFeature')
    .directive('fbFancyButton', function FancyButtonDirective(): ng.IDirective {
        return {
            restrict: 'EA',
            templateUrl: 'Features/SomeFeature/FancyButton.html',
            controller: FancyButtonController,
            controllerAs: 'fancyButton',
            scope: { text: '@' },
            bindToController: true,
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery,
                attrs: ng.IAttributes, controller: FancyButtonController) => {
                element.find('#main-title').text(controller.text);
            }
        }
    });
