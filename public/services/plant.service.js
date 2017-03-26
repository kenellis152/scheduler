(function () {
"use strict";

angular.module('scheduler')
.service('PlantService', PlantService);

//*****************************
//       Plant Service
//*****************************
PlantService.$inject = ['OrdersService', '$http', 'ApiPath', 'LineService', '$q', '$rootScope'];
function PlantService(OrdersService, $http, ApiPath, LineService, $q, $rootScope) {
  var plantService = this;
  plantService.plants = [];

  //*****************************
  //       getPlant(id)
  //*****************************
  // returns promise w/ plant object with given id
  // if it's not initialized, fetch from database, add orders to it, and populate lines
  // if it's initialized (exists on plantService.plants[]), then just return that
  plantService.getPlant = function(id) {
    //see if this plant already initialized, if so, return promise containing result
    if(plantService.plants[id]) {
      var result = $q.defer();
      result.resolve(plantService.plants[id]);
      return result.promise;
    }
    // INITIALIZE PLANT
    //grab the plant from Api
    return fetchPlant(id);
  };

  plantService.createOrder = function (order) {
    OrdersService.addOrder(order).then( function(response) {
      if (response._id) {
        plantService.currentState.plants[0].lines[3].orders.push(response._id);
      }
    });
  };


  //*****************************
  //       Helper functions
  //*****************************

  // *** FETCH PLANT ***
  //grab the plant from Api
  var fetchPlant = function (id) {
    return $http.get(ApiPath + `/plants/${id}`)
    .then( function (response) {
      //grab the lines from Api and attach to the plant object
      return LineService.addLinesToPlant(response.data.plant);
    })
    //grab the open orders, and attach any that aren't attached to a line to the floaters line
    .then( function (plant) {
      return OrdersService.addOpenOrdersToPlant(plant);
    })
    // *** INIT LINE STATES
    .then( function (plant) {
      // make a list of all the orders already scheduled
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
      // save plant to
      plantService.plants[id] = plant;
      broadcastPlants(plantService.plants);
      return plant;
    });
  };

  // take in array of scheduled orders and all open orders
  // return array of unscheduled order ids, sorted by order due dates
  // ** DOESNT SORT YET ** FIX IT
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
  };

  var broadcastPlants = function (plants) {
    $rootScope.$broadcast( 'namespace:plantinfo', {plants});
  };

}; // End Plant Service



})();
