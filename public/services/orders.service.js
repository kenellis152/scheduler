(function () {
"use strict";

angular.module('scheduler')
.service('OrdersService', OrdersService);

OrdersService.$inject = ['$http', 'ApiPath', 'SpecService', '$q'];
function OrdersService($http, ApiPath, SpecService, $q) {
  var service = this;

  service.getOpenOrders = function (plantid) {
    config = {
      params: {
        plant: plantid
      }
    };
    return $http.get(ApiPath + '/orders/open', config).then(function (response) {
      return response.data;
    });
  };

  // Returns promise with array of open orders
  service.getOpenOrderIds = function (plantid) {
    config = {
      params: {
        plant: plantid
      }
    };
    return $http.get(ApiPath + '/orders/open/id', config).then( function (response) {
      return response.data;
    });
  };

  // Attaches array of open order ids to plant object
  service.addOpenOrderIdsToPlant = function(plant) {
    var result = $q.defer();
    service.getOpenOrderIds(plant.id).then( function (data) {
      plant.openOrderIds = data;
      result.resolve(plant);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

  // Attaches array of open orders to plant object
  service.addOpenOrdersToPlant = function(plant) {
    var result = $q.defer();
    service.getOpenOrders(plant.id).then( function (data) {
      plant.openOrders = data;
      result.resolve(plant);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

  service.getOrders = function () {
    return service.orders;
  };

  service.getOrderById = function(id) {
    return $http.get(ApiPath + `/orders/${id}`).then( function (response) {
      return response.data.order;
    }).then( function (order) {
      return SpecService.addSpecToOrder(order);
    })
  };

  service.addOrder = function (order) {
    return $http.post(ApiPath + '/orders/', order).then( function (response) {
      return response.data;
    });
  };


}
})();
