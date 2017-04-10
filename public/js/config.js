/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
 config.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider', 'SessionProvider'];
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider, SessionProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });


    $httpProvider.interceptors.push('HttpInterceptor');

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
            controller: 'PublicController',
            controllerAs: 'pubCtrl'
        })
        .state('index.main', {
            url: "/main",
            // templateUrl: "views/main.html",
            data: { pageTitle: 'Example view' },
            views: {
              'topnav': {
                templateUrl: 'views/main/main.topbar.html'
              },
              'mainview': {
                templateUrl: 'views/main/main.mainview.html',
              }
            }
        })
        .state('index.georgetown', {
            url: "/georgetown",
            // templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        },
                        {
                            serie: true,
                            name: 'angular-flot',
                            files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
                        }
                    ]);
                }
            },
            views: {
              'topnav': {
                templateUrl: 'views/georgetown/georgetown.topbar.html'
              },
              'dashboard': {
                templateUrl: 'views/georgetown/georgetown.dashboard.html'
              },
              'mainview': {
                templateUrl: 'views/georgetown/georgetown.mainview.html',
              }
            }
        })
}
angular
    .module('scheduler')
    .config(config)
    .run(function($rootScope, $state, Session) {
        $rootScope.$state = $state;
        Session.checkToken();
    });
