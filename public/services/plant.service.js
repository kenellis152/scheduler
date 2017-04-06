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
    // this commented code returns local data if available before making an API call
    // I'm commenting it for now, since I don't see where it would be used, but re-making the API call is useful for reverting changes
    // if(plantService.plants[id]) {
    //   var result = $q.defer();
    //   result.resolve(plantService.plants[id]);
    //   return result.promise;
    // }
    // INITIALIZE PLANT
    //grab the plant from Api
    return fetchPlant(id);
  };

  //*****************************
  //       addOrder (order)
  //*****************************
  // takes an order as a parameter and pushes it onto the unscheduled line for the plant it's assigned to
  // DOES NOT INTERACT WITH API. ONLY ADDS AN EXISTING ORDER THAT (presumably) IS NOT ON THE BOARD YET
  // ORDER SERVICE ACTUALLY ADDS/REMOVES, not plant service
  plantService.addOrder = function (order) {
    var unscheduledlineindex = plantService.plants[order.plant].lines.length - 1;
    plantService.plants[order.plant].lines[unscheduledlineindex].orders.push(order);
  }

  //*****************************
  //       updateOrder (order)
  //*****************************
  // takes an order object with the intention of updating the views (by modifying the state on this service)
  // Also takes the bool updateLines which lets this function know if the lines need to be updated (if order was cancelled or plant was changed)
  // if order change is valid and view is updated, submit to Orders service to update the database
  // DOES NOT DIRECTLY MODIFY THE DATABASE
    plantService.updateOrder = function (order, updateLinesFlag) {
    // let the order card containing this order know that it has been updated
    broadcastUpdateOrder(order);

    // don't know what the intent of this is
    broadcastUpdateBoard();

    if (updateLinesFlag) {
      plantService.removeOrder(order._id);
    }
  }

  //*****************************
  //       removeOrder (orderid, plantid)
  //*****************************
  // takes order id
  // remove order from the run BOARD
  // DOES NOT INTERACT WITH THE API. ONLY REMOVES IT FROM THE RUN BOARD
  // ORDER SERVICE ACTUALLY ADDS/REMOVES, not plant service
  plantService.removeOrder = function (id) {
    plantService.plants.forEach( function (plant) {
      plant.lines.forEach( function (line) {
        var result = findOrder(id, line.orders);
        if (result !== -1) {
          // then the order was found and result has the index
          // FIRST REMOVE IT FROM THE LINE AND SAVE IT OR ELSE ALL THE LINES GET FUCKED
          // copy to new array
          var newOrders = line.orders.slice();
          // delete the order off the new array
          newOrders.splice(result, 1);
          var changeBody = {orders: newOrders};
          // delete from line database, then remove from local order list if successfull
          if (line.name !== "Unscheduled") {
            LineService.updateLine(line._id, changeBody).then( function (newline) {

            }).catch( function (err) {
              console.log('failed to delete order:', err);
            });
          }
          // remove it locally now that we've removed it from the line and calmed down a little
          line.orders.splice(result, 1);
        }
      });
    });
  }

  //*****************************
  //       saveChanges (plantid)
  //*****************************
  // saves the displayed line state (orders assigned to each line) to the REST API
  plantService.saveChanges = function (plantid) {
    var promises = [];
    console.log(plantid, plantService.plants[plantid])
    plantService.plants[plantid].lines.forEach( function (line) {
      var body = {};
      body.orders = [];
      line.orders.forEach( function (order) {
        body.orders.push(order._id);
      });
      if (line.name !== 'Unscheduled') {promises.push($http.patch(ApiPath + `/lines/${line._id}`, body))};
    });
    $q.all(promises).then( function (results) {
      console.log('successfully saved');
    }).catch( function (err) {
      console.log('error saving', err);
    });
  }

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
      initLines(plant);
      // save plant to service
      plantService.plants[id] = plant;
      //broadcast the loaded plant info
      broadcastPlants(plantService.plants);
      // console.log(plant);
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

  // takes an order id and an array of orders
  // Returns the object from the array with matching id
  // Return -1 if not found
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

  // Finds order among all locally stored orders.
  // Returns -1 if not found
  var findOrderAllPlants = function (id) {
    var result;
    plantService.plants.forEach( function (plant) {
      plant.lines.forEach( function (line) {
        var thisResult = findOrder(id, line.orders);
        if (thisResult !== -1) {
          result = thisResult;
        }
      });
    });
    if( result ) {
      return result;
    } else {
      return -1;
    }
  };

  // Takes a plant object with an array of lines, each with an array of order ids
  // replaces the array of order ids with the array of orders
  var initLines = function (plant) {
    var scheduled = [];
    plant.lines.forEach( function (line) {
      var orders = []; //stores actual orders
      // make a list of all the orders already scheduled
      // note that 'orders' at this point are still ids, not order objects
      line.orders.forEach(function (order) {
        var thisOrder = findOrder(order, plant.openOrders);
        if (thisOrder !== -1) {
          scheduled.push(order);
          orders.push(thisOrder);
        }
      });
      //replace each array of order ids with an array of the actual orders
      line.orders = orders;
    });
    // Create a line with unscheduled orders and push it on to line arrays
    var floaters = getFloaters(scheduled, plant.openOrders);
    floaters.name = "Unscheduled";
    plant.lines.push(floaters);
  }

  // broadcast that a plant has been updated and pass along plant info
  var broadcastPlants = function (plants) {
    $rootScope.$broadcast( 'namespace:plantinfo', {plants});
  };

  var broadcastUpdateBoard = function () {
    $rootScope.$broadcast( 'namespace:updateboard', {});
  };

  // intent is to notify the order card containing this order that it's underlying order has changed and it needs to re-update
  var broadcastUpdateOrder = function (order) {
    $rootScope.$broadcast( `namespace:order:${order._id}`, {order});
  };

}; // End Plant Service



})();
