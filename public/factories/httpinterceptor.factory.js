(function () {
"use strict";

angular.module('scheduler')
.factory('HttpInterceptor', HttpInterceptor);

//*****************************
//       httpinterceptor
//*****************************
// Keeps track of the authenticated session
//
HttpInterceptor.$inject = ['$injector'];
function HttpInterceptor($injector) {

  return {
    request: function (config) {
      var Session = $injector.get('Session');
      config.headers = config.headers || {};
      var user = Session.getUser();
      config.headers['x-schedulerauth'] = user.token || null;
      return config;
    }
  }

} // end httpinterceptor

})();
