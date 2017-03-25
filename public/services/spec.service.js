(function () {
"use strict";

angular.module('scheduler')
.service('SpecService', SpecService);

SpecService.$inject = ['$http', 'ApiPath', '$q'];
function SpecService($http, ApiPath, $q) {
  var service = this;

  service.getSpecByPart = function(part) {
    return $http.get(ApiPath + `/resinspecs/${part}`).then( function (response) {
      return response.data;
    });
  };

  service.addSpecToOrder = function(order) {
    var result = $q.defer();
    service.getSpecByPart(order.part).then( function (data) {
      order.spec = data.spec;
      result.resolve(order);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

}

})();
