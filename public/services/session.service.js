(function () {
"use strict";

angular.module('scheduler')
.service('SessionService', SessionService);

//*****************************
//       SessionService
//*****************************
// Keeps track of the authenticated session
//
SessionService.$inject = ['$window', '$http', 'ApiPath'];
function SessionService($window, $http, ApiPath) {
  var service = this;

  // initialization
  service.user = {};
  service.user.token = $window.localStorage['x-schedulerauth'];
  console.log(`token on init is ${service.user.token}`)
  if (service.user.token) {
    $http.get(ApiPath + '/users/me').then( function (user) {
      service.user = user;
    }, function (e) {
      service.user.email = "guest";
    });
  }

 // service.user = {email: "guest", token: $window.localStorage['x-schedulerauth']};

  service.login = function (user) {
    console.log(`trying to log in as user ${user.email}`);
    return $http.post(ApiPath + `/users/login`, user).then( function (response) {
      service.saveToken(response.headers('x-schedulerauth'));
      console.log('successfully logged in', response, response.data.email);
      service.setEmail(response.data.email);
      return response.data;
    }).catch( function(e) {
      console.log('failed to log in', e);
    });
  };

  // save token to local storage
  service.saveToken = function(token) {
    $window.localStorage['x-schedulerauth'] = token;
    service.user.token = token;
  }

  // retrieve token from local storage
  service.getToken = function () {
    return service.user.token;
  }

  // clear token from local storage
  service.clearToken = function () {
    $window.localStorage['x-schedulerauth'] = "";
  }

  service.setEmail = function (email) {
    service.user.email = email;
  }
  service.getUser = function () {
    return service.user;
  }

} // end SessionService

})();
