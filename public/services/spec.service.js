(function () {
"use strict";

angular.module('scheduler')
.service('SpecService', SpecService);

SpecService.$inject = ['$http', 'ApiPath'];
function SpecService($http, ApiPath) {
  var service = this;

  service.getSpecByPart = function(part) {
    return $http.get(ApiPath + `/resinspecs/${part}`).then( function (response) {
      return response.data;
    });
  };

  // service.addSpecToOrder = function(order) {
  //   var result = $q.defer();
  //
  //   return deferred.promise;
  // };


}



})();
