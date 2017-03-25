(function () {
"use strict";

angular.module('scheduler')
.service('PlantService', PlantService);

// '$http', 'ApiPath'
PlantService.$inject = ['OrdersService', '$http', 'ApiPath', 'LineService'];
function PlantService(OrdersService, $http, ApiPath, LineService) {
  var plantService = this;
  plantService.currentState = {};
  plantService.currentState.plants = [];

  //*****************************
  // GET OPEN ORDERS, INIT LINE STATES
  //*****************************
  OrdersService.getOpenOrders().then( function (response) {
    plantService.openOrders = response;
    return response;
  }).then( function(response) {
    // console.log('plant service open orders', plantService.openOrders);
    // INITIALIZE PLANT STATES HERE, HAVING RETRIEVED OPEN ORDERS
  });

  plantService.getPlant = function(id) {
    //grab the plant from Api
    return $http.get(ApiPath + `/plants/${id}`)
    .then( function (response) {
      //grab the lines from Api and attach to the plant object
      return LineService.addLinesToPlant(response.data.plant);
    }).then( function (plant) {
      //grab the open orders, and attach any that aren't attached to a line to the floaters line
      return OrdersService.addOpenOrderIdsToPlant(plant);
    })
    .then( function (plant) {
      //grab the open orders, and attach any that aren't attached to a line to the floaters line
      return OrdersService.addOpenOrdersToPlant(plant);
    })
    .then( function (plant) {
      // *** INIT LINE STATES

      //make a list of all the orders already scheduled
      var scheduled = []; //make a list of all the orders already scheduled
      plant.lines.forEach( function (line) {
        line.orders.forEach(function (order) {
          scheduled.push(order);
        });
      });

      // Create a line with unscheduled orders and push it on to line arrays
      var floaters = getFloaters(scheduled, plant.openOrders);
      console.log("floaters", floaters);
      plant.lines.push(floaters);
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

  plantService.currentState.orders = OrdersService.getOrders();

  plantService.getState = function () {
    return plantService.currentState;
  };

  // take in array of scheduled orders and all open orders
  // return array of unscheduled order ids, sorted by order due dates
  var getFloaters = function (scheduled, orders) {
    var floaters = {orders: []};
    var unscheduled = [];
    orders.forEach( function (element) {
      if( scheduled.indexOf(element._id) === -1) {
        floaters.orders.push(element._id);
      }
    });
    return floaters;
  };

}; // End Plant Service



})();
