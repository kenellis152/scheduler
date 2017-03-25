(function () {
"use strict";

angular.module('scheduler')
.service('PlantService', PlantService);

// '$http', 'ApiPath'
PlantService.$inject = ['OrdersService', '$http', 'ApiPath', 'LineService'];
function PlantService(OrdersService, $http, ApiPath, LineService) {
  var plantService = this;

  plantService.getPlant = function(id) {
    //grab the plant from Api
    return $http.get(ApiPath + `/plants/${id}`)
    .then( function (response) {
      //grab the lines from Api and attach to the plant object
      return LineService.addLinesToPlant(response.data.plant);
    })
    .then( function (plant) {
      //grab the open orders, and attach any that aren't attached to a line to the floaters line
      return OrdersService.addOpenOrdersToPlant(plant);
    })
    .then( function (plant) {
      // *** INIT LINE STATES

      // make a list of all the orders already scheduled
      // replace
      var scheduled = [];
      plant.lines.forEach( function (line) {
        var orders = []; //stores actual orders
        //make a list of all the orders already scheduled
        line.orders.forEach(function (order) {
          scheduled.push(order);
          orders.push(findOrder(order, plant.openOrders));
        });
        //replace each array of order ids with an array of the actual orders
        line.orders = orders;
      });

      // Create a line with unscheduled orders and push it on to line arrays
      var floaters = getFloaters(scheduled, plant.openOrders);
      floaters.name = "Unscheduled";
      plant.lines.push(floaters);

      console.log("new plant" , plant);

      return plant;
    });
  };

  plantService.createOrder = function (order) {
    OrdersService.addOrder(order).then( function(response) {
      if (response._id) {
        plantService.currentState.plants[0].lines[3].orders.push(response._id);
      }
    });
  };

  plantService.getState = function () {
    return plantService.currentState;
  };

  // take in array of scheduled orders and all open orders
  // return array of unscheduled order ids, sorted by order due dates
  // ** DOESNT SORT YET ** FIX THAT
  var getFloaters = function (scheduled, orders) {
    var floaters = {orders: []};
    var unscheduled = [];
    orders.forEach( function (element) {
      if( scheduled.indexOf(element._id) === -1) {
        floaters.orders.push(findOrder(element._id, orders));
      }
    });
    return floaters;
  };

  // takes an id and an array of orders
  // Returns the object from the array with matching id
  var findOrder = function (id, orders) {
    var result;
    orders.forEach( function (order) {
      if(order._id === id) {
        result = order;
      }
    });
    if( result ) {
      return result;
    } else {
      return -1;
    }
  }


}; // End Plant Service



})();
