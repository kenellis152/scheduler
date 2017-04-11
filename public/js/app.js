/**
 * INSPINIA - Responsive Admin Theme
 *
 */
var host = window.location.hostname;
var ApiPath;
if (host === 'localhost') {
    ApiPath = 'http://localhost:3000';
} else {
  ApiPath = 'http://glacial-everglades-27245.herokuapp.com';
}



(function () {
    angular.module('scheduler', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ngMaterial'
    ])
    .constant('ApiPath', ApiPath)
})();
