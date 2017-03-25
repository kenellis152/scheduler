/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('scheduler', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ngMaterial'
    ])
    .constant('ApiPath', 'http://localhost:3000')
})();
