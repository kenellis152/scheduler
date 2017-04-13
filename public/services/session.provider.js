(function () {
"use strict";

angular.module('scheduler')
.provider('Session', SessionProvider);

//*****************************
//       SessionService
//*****************************
// Keeps track of the authenticated session
//
SessionProvider.$inject = [];
function SessionProvider() {

  var provider = this;

  provider.$get = function($window, $http, ApiPath, $mdToast, $rootScope) {
    var service = {};
    // var $window = $windowProvider.$get();
    // initialization
    service.user = {email: 'guest'};
    service.user.token = $window.localStorage['x-schedulerauth'];

   // service.user = {email: "guest", token: $window.localStorage['x-schedulerauth']};

    service.login = function (user) {
      console.log("trying to log in as user " + user.email);
      return $http.post(ApiPath + '/users/login', user).then( function (response) {
        service.saveToken(response.headers('x-schedulerauth'));
        console.log('successfully logged in', response, response.data.email);
        service.setEmail(response.data.email);
        showToast('Logged in as ' + response.data.email);
        broadcastStatus(true);
        return response.data;
      }).catch( function(e) {
        failToast('Login failed');
        console.log('failed to log in', e);
      });
    };

    service.logout = function () {
      $window.localStorage['x-schedulerauth'] = "";
      service.user.email = 'guest';
      service.user.token = '';
      console.log('logged out');
      showToast('Logged out!');
      broadcastStatus(false);
    }

    service.checkToken = function () {
      if (service.user.token) {
        $http.get(ApiPath + '/users/me').then( function (response) {
          service.user = response.data;
          broadcastStatus(true);
        }, function (e) {
          service.user.email = "guest";
          broadcastStatus(true);
        });
      }
    }

    // return true if logged in, false if not
    service.getLoginStatus = function () {
      if (service.user.email === "guest") {
        return false;
      } else {
        return true;
      }
    }

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

    var showToast = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .hideDelay(2000)
      );
    }

    var failToast = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .hideDelay(2000)
      );
    }

    var broadcastStatus = function (status) {
      $rootScope.$broadcast('namespace:loginStatus', {status: status});
    }

    return service;
  }

} // end SessionService

})();
