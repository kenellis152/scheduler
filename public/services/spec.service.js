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
      // storeLocal(response.data);
      return response.data;
    });
  };

  // takes an array of part numbers
  // returns array back array of specs for the part numbers
  service.getSpecArray = function(parts) {
    // var promises = [];
    // parts.forEach( function (part) {
    //   promises.push(service.getSpecByPart(part));
    // });
    // return $q.all(promises);
    var fullPath = ApiPath + '/resinspecs/partarray';
    return $http.post(fullPath, parts).then( function (response) {
      // storeLocal(response.data);
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
    // var promises = [];
    // orders.forEach( function (order) {
    //   promises.push(service.getSpecByPart(order.part));
    // });
    // return $q.all(promises)
    var parts = [];
    orders.forEach ( function (order) {
      parts.push(order.part);
    })
    return service.getSpecArray(parts).then( function (results) {
      for (var i = 0; i < orders.length; i++) {
        // orders[i].spec = results[i].spec;
        orders[i].spec = getSpecFromArray(orders[i].part, results);
      }
      return Promise.resolve(orders);
    });
  };

  //*****************************
  // getSpecFromArray(part, specs)
  //*****************************
  // @param part - part number we're looking for
  // @param specs - array of specs we are searching through
  // tests: NOT DONE
  var getSpecFromArray = function (part, specs) {
    var result;
    specs.forEach( function (spec) {
      if (spec.part === part) {
        result = spec;
      }
    });
    return result;
  }

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
