(function () {
"use strict";

angular.module('scheduler')
.factory('HttpInterceptor', HttpInterceptor);

//*****************************
//       httpinterceptor
//*****************************
// Keeps track of the authenticated session
//
HttpInterceptor.$inject = ['SessionService'];
function HttpInterceptor(SessionService) {

  return {
    request: function (config) {
      config.headers = config.headers || {};
      config.headers['x-schedulerauth'] = SessionService.getToken();
      return config;
    }
  }

} // end httpinterceptor

})();
