(function () {
"use strict";

angular.module('scheduler')
.service('SessionService', SessionService);

//*****************************
//       SessionService
//*****************************
// Keeps track of the authenticated session
//
SessionService.$inject = ['$window'];
function SessionService($window) {
  var service = this;

  $window.localStorage['x-schedulerauth'] = 'abcde';

  // save token to local storage
  service.saveToken = function(token) {
    $window.localStorage['x-schedulerauth'] = token;
  }

  // retrieve token from local storage
  service.getToken = function () {
    return $window.localStorage['x-schedulerauth'];
  }

  // clear token from local storage
  service.clearToken = function () {
    $window.localStorage['x-schedulerauth'] = "";
  }

} // end SessionService

})();
