(function () {
"use strict";

angular.module('scheduler')
.service('OrdersService', OrdersService);

//*****************************
//       Orders Service
//*****************************
// Interface with the Order API
// Locally store/fetch orders once retrieved from the API
// tests: NOT DONE
  //*****************************
  //       To Do
  //*****************************
  // Implement Unit tests
  // Implement daysOut
  // Implement validateOrder

OrdersService.$inject = ['$http', 'ApiPath', 'SpecService', '$q'];
function OrdersService($http, ApiPath, SpecService, $q) {
  var service = this;
  service.orders = [];

  //*****************************
  //    getOpenOrders(plantid)
  //*****************************
  // @param plantid - the id number of the plant to fetch open orders for
  // returns an array of order objects - all orders that are 'open' (not
  // yet completed or cancelled) for the given plant id
  // tests: NOT DONE
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

  //*****************************
  //addOpenOrdersToPlant(plantid)
  //*****************************
  // @param plantid - the id number of the plant to fetch open orders for
  // Attaches array of open orders to plant object, and returns the plant
  // wrapped up in a promise
  // tests: NOT DONE
  service.addOpenOrdersToPlant = function(plant) {
    var result = $q.defer();
    service.getOpenOrders(plant.id).then( function (data) {
      plant.openOrders = data;
      plant.openOrderIds = [];
      data.forEach( function (elem) {
        plant.openOrderIds.push(elem._id);
        // store the order locally for retrieval in the future without having to make an API call
        service.storeOrder(elem);
      });
      result.resolve(plant);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

  // *****************
  // Not Currently USED
  // *****************
  service.getOrderById = function(id) {
    var fullPath = ApiPath + '/orders/' + id;
    return $http.get(fullPath).then( function (response) {
      console.log('calling getOrderById');
      return response.data.order;
    }).then( function (order) {
      return SpecService.addSpecToOrder(order);
    })
  };

  //*****************************
  // getOrdersFromDaysBack(days)
  //*****************************
  // *****************
  // Work in Progress
  // *****************
  // @param days - the number of days back to fetch orders from
  //     i.e. if days == 4, get all orders with due date >= (4 days before today)
  // return an array of order objects
  // tests: NOT DONE
  service.getOrdersFromDaysBack = function(days) {
    var fullPath = ApiPath + '/orders/daysback/' + days;
    return $http.get(fullPath).then( function (response) {
      console.log('calling getOrderById');
      return response.data.orders;
    }).then( function (order) {
      return SpecService.addSpecToOrder(order);
    })
  };

  //*****************************
  //      addOrder (order)
  //*****************************
  // @param order - order object to add to the database
  // Stores an order object to the REST API
  // tests: NOT DONE
  service.addOrder = function (order) {
    return $http.post(ApiPath + '/orders/', order).then( function (response) {
      service.storeOrder(response.data);
      return response.data;
    });
  };

  //*****************************
  //    deleteOrder (orderId)
  //*****************************
  // @param orderId - _id attribute of the order to be removed from the database
  // removes the order object from the REST API with the given _id attribute
  // tests: NOT DONE
  service.deleteOrder = function (orderId) {
    return $http.delete(ApiPath + '/orders/' + orderId).then( function(response) {
      console.log('Order ' + orderId + ' Deleted');
    }).catch( function (err) {
      console.log('Failed to delete order', err);
    })
  }

  //*****************************
  //    changeOrder (order)
  //*****************************
  // @param order - order object to be updated
  // Changes the order in the database, attaches new spec if necessary
  // tests: NOT DONE
  service.changeOrder = function (order) {
    var oldOrder = service.retrieveOrder(order._id);
    //make the api call to patch the order object
    return $http.patch(ApiPath + '/orders/' + order._id, order).then( function(response) {
      return response.data.order;
    }).then( function (order) {
      //attach the (maybe) new spec to the order
      return SpecService.addSpecToOrder(order);
    }).then( function (order) {
      //update the order object that is stored locally
      service.copyOrder(oldOrder, order);
      var result = $q.defer();
      result.resolve(order);
      //return the promise for PlantService to update the line on which it is stored, if necessary
      return result.promise;
    }).catch( function (err) {
      console.log('Failed to update order', err);
    })
  }

  //*****************************
  //       Helper functions
  //*****************************

  //*****************************
  //    storeOrder (order)
  //*****************************
  // @param order - object to be stored locally (on this service)
  // Locally (on this service) stores an order. If order with idential _id exists, replace it
  // tests: NOT DONE
  service.storeOrder = function (order) {
    var retrieveResult = service.retrieveOrder(order._id);
    if (retrieveResult === -1) {
      service.orders.push(order);
    } else {
      // retrieveResult = order;
      service.copyOrder(retrieveResult, order);
    }
  }

  //*****************************
  //    retrieveOrder (id)
  //*****************************
  // @param id - _id attridbute of the order object to fetch
  // Take an order id, return the order if the id is found locally, else return -1
  // tests: NOT DONE
  service.retrieveOrder = function (id) {
    var result;
    service.orders.forEach( function (order) {
      if (order._id === id) {
        result = order;
      }
    })
    if (result) {
      return result;
    } else {
      return -1;
    }
  }

  //*********************************
  // copyOrder (destination, source)
  //*********************************
  // @param destination - the order object to be copied into
  // @param source - the order object to be copied
  // Copy the source object key values into the destination object
  // tests: NOT DONE
  service.copyOrder = function (destination, source) {
    for(var k in source) destination[k] = source[k];
  }

  //*****************************
  //    daysOut (order)
  //*****************************
  //*****************************
  //    WORK IN PROGRESS
  //*****************************
  // @param order - the order to analyze
  // returns the number of days (from today) until order is due
  // tests: NOT DONE
  service.daysOut = function (order) {
    console.log(order.dueDate);
  }

  //*****************************
  //    validateOrder (order)
  //*****************************
  //*****************************
  //    WORK IN PROGRESS
  //*****************************
  // @param order - the order to validate
  // Make sure order has a valid part. Return true/false
  // tests: NOT DONE
  service.validateOrder = function (order) {

  }

  //*****************************
  //    computeRunTime (order)
  //*****************************
  //*****************************
  //    WORK IN PROGRESS
  //*****************************
  // @param order - the order to compute the run time on
  // Compute the run time of an order. Return -1 if the spec is not attached and print to the console
  // Otherwise, return the estimated time to run the order in hours
  // tests: NOT DONE
  service.computeRunTime = function (order) {
    if(!order.spec) {
      return -1;
    }
    const RUNRATEMODIFIER = 0.64; //to account for downtime and OEE
    var runRate = 134; //default to the highest possible run rate, and run all checks that may lower the run rate. This ensures that lower run rates override higher ones.
    if (order.spec.formulation === 'H10') runRate = 120;
    if (order.spec.viscosity === 'TOOSPEEDIE') runRate = 118;
    if (order.spec.formulation === 'H5') runRate = 110;
    if (order.spec.mmCartridgeDiameter == 32) runRate = 95;
    if (order.spec.mmCartridgeDiameter == 35) runRate = 90;
    if (order.spec.mmCartridgeDiameter == 35) runRate = 90;
    if (order.spec.clip !== "None") runRate = 67;
    if (order.spec.mmCartridgeDiameter == 40) runRate = 40;

    runRate = runRate * RUNRATEMODIFIER;
    if (order.completed === undefined) order.completed = 0;
    var totalFootage = order.spec.cartridgeLength * (order.quantity - order.completed) / 12;

    var result = totalFootage / runRate / 60;
    // console.log('computed: ' + result + ' for order:' + order);
    return result;
  }

}
})();
