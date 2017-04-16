(function () {
"use strict";

angular.module('scheduler')
.service('SpecService', SpecService);

SpecService.$inject = ['$http', 'ApiPath', '$q'];
function SpecService($http, ApiPath, $q) {
  var service = this;

  service.specs = {};

  service.getSpecByPart = function(part) {
    var local = findLocal(part);
    if (local) return Promise.resolve(local);
    var fullPath = ApiPath + '/resinspecs/' + part;
    return $http.get(fullPath).then( function (response) {
      storeLocal(response.data);
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
    var local = findLocal(order.part);
    if (local) {
      order.spec = local;
      return Promise.resolve(order);
    }
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
    var promises = [];
    orders.forEach( function (order) {
      promises.push(service.getSpecByPart(order.part));
    });
    return $q.all(promises).then( function (results) {
      for (var i = 0; i < orders.length; i++) {
        orders[i].spec = results[i].spec;
      }
      return Promise.resolve(orders);
    });
  };

  //*****************************
  //       storeLocal()
  //*****************************
  // @param spec - the spec to store if it doesn't already exist
  // does nothing if spec already exists
  // stores on service.specs[] if it doesn't already exist
  // tests: NOT DONE
  var storeLocal = function (spec) {
    if (!findLocal(spec.part)) {
      // console.log('storing spec locally', spec);
      service.specs[spec.part] = spec;
    }
  }

  //*****************************
  //       findLocal()
  //*****************************
  // @param part - the part number of the spec we're looking for
  // return the spec if it is found
  // return 0 if not found
  // tests: NOT DONE
  var findLocal = function (part) {
    if (service.specs[part]) {
      return service.specs[part];
    }
    return 0;
  }

}

})();
