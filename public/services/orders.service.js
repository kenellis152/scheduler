(function () {
"use strict";

angular.module('scheduler')
.service('OrdersService', OrdersService);

OrdersService.$inject = ['$http', 'ApiPath', 'SpecService', '$q'];
function OrdersService($http, ApiPath, SpecService, $q) {
  var service = this;
  service.orders = [];

  service.getOpenOrders = function (plantid) {
    config = {
      params: {
        plant: plantid
      }
    };
    return $http.get(ApiPath + '/orders/open', config).then(function (response) {
      return response.data;
    });
    // .then( function(orders) {
    //   return SpecService.addSpecsToOrdersArray(orders);
    // });
  };

  // Attaches array of open orders to plant object
  service.addOpenOrdersToPlant = function(plant) {
    var result = $q.defer();
    service.getOpenOrders(plant.id).then( function (data) {
      plant.openOrders = data;
      plant.openOrderIds = [];
      data.forEach( function (elem) {
        plant.openOrderIds.push(elem._id);
        storeOrder(elem);
      });
      result.resolve(plant);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

  // NOT CURRENTLY USED
  service.getOrderById = function(id) {
    return $http.get(ApiPath + `/orders/${id}`).then( function (response) {
      console.log('calling getOrderById');
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

  service.deleteOrder = function (orderId) {
    return $http.delete(ApiPath + `/orders/${orderId}`).then( function(response) {
      console.log(`Order ${orderId} Deleted`);
    }).catch( function (err) {
      console.log('Failed to delete order', err);
    })
  }

  service.changeOrder = function (order) {
    return $http.patch(ApiPath + `/orders/${order._id}`, order).then( function(response) {
      console.log(`Order ${order._id} updated`, response);
      return response.data.order;
    }).catch( function (err) {
      console.log('Failed to update order', err);
    })
  }

    //*****************************
    //       Helper functions
    //*****************************

  // Take an order, store it if it isn't found, replace the existing order if it already exists
  var storeOrder = function (order) {
    var retrieveResult = retrieveOrder(order._id);
    if (retrieveResult === -1) {
      service.orders.push(order);
    } else if (!_.isEqual(order, retrieveResult)) {
      retrieveResult = order;
    }
  }

  // Take an order id, return the order if the id is found locally, else return -1
  var retrieveOrder = function (id) {
    var result;
    service.orders.forEach( function (order) {
      if (order._id === id) {
        result = order;
      }
    });
    if (result) {
      return result;
    } else {
      return -1;
    }
  }

}
})();
