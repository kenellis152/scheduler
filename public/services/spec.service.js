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


  // ** IN PROGRESS - DOESN'T WORK
  // Don't know how to pass an array of params to a get request.
  // takes an array of part numbers
  // returns array back array of specs for the part numbers
  service.getSpecArray = function(parts) {
    console.log(parts);
    return $http.post(ApiPath + '/resinspecs/partarray', parts)
    .then( function (response) {
      console.log("response", response);
      return response.data;
    });
  };

  // takes an order object
  // returns order object with specs attached
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

  // takes an array of order objects
  // returns array of order objects with specs attached to each object
  service.addSpecsToOrdersArray = function(orders) {
    var result = $q.defer();
    var parts = [];
    orders.forEach( function (order) {
      parts.push(order.part);
    });
    service.getSpecArray(parts).then( function (data) {
      // order.spec = data.spec;
      console.log("spec array", data);
      result.resolve(order);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

}

})();
