

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
            data: { pageTitle: 'Main Dashboard' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
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
                templateUrl: 'views/main/main.topbar.html'
              },
              'mainview': {
                templateUrl: 'views/main/main.mainview.html',
              }
            }
        })
        .state('index.georgetown-dash', {
            url: "/georgetown-dash",
            // templateUrl: "views/minor.html",
            data: { pageTitle: 'Georgetown Resin Overview' },
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
                templateUrl: 'views/georgetown-dash/gtdash.topbar.html'
              },
              'mainview': {
                templateUrl: 'views/georgetown-dash/gtdash.mainview.html',
              }
            }
        })
        .state('index.georgetown-resin', {
            url: "/georgetown-resin",
            // templateUrl: "views/minor.html",
            data: { pageTitle: 'Georgetown Resin Schedule' },
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
                templateUrl: 'views/georgetown-resin/georgetown.topbar.html'
              },
              'dashboard': {
                templateUrl: 'views/georgetown-resin/georgetown.dashboard.html'
              },
              'mainview': {
                templateUrl: 'views/georgetown-resin/georgetown.mainview.html',
              }
            }
        })
        .state('index.bluefield-resin', {
            url: "/bluefield-resin",
            // templateUrl: "views/minor.html",
            data: { pageTitle: 'Bluefield Resin Schedule' },
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
                templateUrl: 'views/bluefield-resin/bluefield.topbar.html'
              },
              'dashboard': {
                templateUrl: 'views/bluefield-resin/bluefield.dashboard.html'
              },
              'mainview': {
                templateUrl: 'views/bluefield-resin/bluefield.mainview.html',
              }
            }
        })
        .state('index.utils', {
            url: "/utils",
            // templateUrl: "views/minor.html",
            data: { pageTitle: 'Scheduler Utilities' },
            views: {
              'topnav': {
                templateUrl: 'views/utils/utils.topbar.html'
              },
              'mainview': {
                templateUrl: 'views/utils/utils.mainview.html',
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
