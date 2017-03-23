/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('scheduler', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
    ])
    .constant('ApiPath', 'http://localhost:3000')
})();
