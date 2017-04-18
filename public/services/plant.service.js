(function () {
"use strict";

angular.module('scheduler')
.service('PlantService', PlantService);

//*****************************
//       Plant Service
//*****************************

  //*****************************
  //          To Do
  //*****************************
  // make getFloaters sort the unscheduled orders by due date
  // finish documentation - starting from getFloaters

PlantService.$inject = ['OrdersService', '$http', 'ApiPath', 'LineService', '$q', '$rootScope'];
function PlantService(OrdersService, $http, ApiPath, LineService, $q, $rootScope) {
  var plantService = this;
  plantService.plants = [];

  //*****************************
  //       getPlant(id)
  //*****************************
  // @param id - id (as in plant warehouse #, not the mongodb _id property) of the plant to fetch
  // returns promise w/ plant object with given id
  // if it's not initialized, fetch from database, add orders to it, and populate lines
  // if it's initialized (exists on plantService.plants[]), then just return that
  // tests: NOT DONE
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
  //       getPlantInfo(id)
  //*****************************
  // @param id - id (as in plant warehouse #, not the mongodb _id property) of the plant to fetch
  // returns promise w/ plant info only - none of the orders attached
  // tests: NOT DONE
  plantService.getPlantInfo = function(id) {
    var fullPath = ApiPath + '/plants/' + id;
    return $http.get(fullPath);
  }

  //*********************************************************
  //   updatePlant(id, activeShifts, shiftHours, numLines)
  //*********************************************************
  // @param id - id (as in plant warehouse #, not the mongodb _id property) of the plant to fetch
  // @param activeShifts - they number of active shifts the plant will be running per day
  // @param shiftHours - the number of hours each shift will run
  // @param numLines - the number of active lines the plant will run
  // returns promise w/ plant info only - none of the orders attached
  // tests: NOT DONE
  plantService.updatePlant = function(id, activeShifts, shiftHours, numLines) {
    var body = {activeShifts, shiftHours, numLines}
    var fullPath = ApiPath + '/plants/' + id;
    return $http.patch(fullPath, body).then( function (result) {
      console.log('result is', result);
      return Promise.resolve(result.data.plant);
    });
  }

  //*****************************
  //       addOrder (order)
  //*****************************
  // @param order - order object to be updated
  // takes an order as a parameter and pushes it onto the unscheduled line for the plant it's assigned to
  // DOES NOT INTERACT WITH API. ONLY ADDS AN EXISTING ORDER THAT (presumably) IS NOT ON THE BOARD YET
  // ORDER SERVICE ACTUALLY ADDS/REMOVES, not plant service
  // tests: NOT DONE
  plantService.addOrder = function (order) {
    var unscheduledlineindex = plantService.plants[order.plant].lines.length - 1;
    plantService.plants[order.plant].lines[unscheduledlineindex].orders.push(order);
  }

  //*****************************
  //     updateOrder (order)
  //*****************************
  // @param order - order object to be updated
  // @param updateLinesFlag - set to true if the lines need to be updated (which will be if order is cancelled/complete/moved to another plant)
  // takes an order object with the intention of updating the views (by modifying the state on this service)
  // Also takes the bool updateLines which lets this function know if the lines need to be updated (if order was cancelled or plant was changed)
  // if order change is valid and view is updated, submit to Orders service to update the database
  // DOES NOT DIRECTLY MODIFY THE DATABASE
  // tests: NOT DONE
    plantService.updateOrder = function (order, updateLinesFlag) {
    // let the order card containing this order know that it has been updated
    broadcastUpdateOrder(order);
    // if the lines need to be updated (order removed), broadcast to update
    if (updateLinesFlag) {
      plantService.removeOrder(order._id);
      broadcastUpdateBoard();
    }
  }

  //*****************************
  //       removeOrder (orderid, plantid)
  //*****************************
  // @param orderid - _id property (mongodb assigned) of the order to remove
  // @param plantid - plant id (whse number, not mongodb _id) of the plant to remove from
  // remove order from the run BOARD
  // DOES NOT INTERACT WITH THE API. ONLY REMOVES IT FROM THE RUN BOARD
  // ORDER SERVICE ACTUALLY ADDS/REMOVES, not plant service
  // tests: NOT DONE
  plantService.removeOrder = function (id) {
    plantService.plants.forEach( function (plant) {
      plant.lines.forEach( function (line) {
        var result = findOrder(id, line.orders);
        if (result !== -1) {
          // then the order was found and result has the index
          // FIRST REMOVE IT FROM THE LINE AND SAVE IT OR ELSE ALL THE LINES GET BORKED
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
  //    saveChanges (plantid)      SAVES LINE STATES
  //*****************************
  // @param plantid - plant id (whse number, not mongodb _id) of the plant save current state for
  // saves the displayed line state (orders assigned to each line) to the REST API
  // tests: NOT DONE
  plantService.saveChanges = function (plantid) {
    var promises = [];
    console.log(plantid, plantService.plants[plantid])
    plantService.plants[plantid].lines.forEach( function (line) {
      var body = {};
      body.orders = [];
      line.orders.forEach( function (order) {
        body.orders.push(order._id);
      });
      var fullPath = ApiPath + '/lines/' + line._id;
      if (line.name !== 'Unscheduled') {promises.push($http.patch(fullPath, body))};
    });
    $q.all(promises).then( function (results) {
      console.log('successfully saved');
    }).catch( function (err) {
      console.log('error saving', err);
    });
  }

  //*****************************
  // getInventory(part, plantid)
  //*****************************
  // @param part - part # of inventory item we are looking for
  // @param plant - id (as in plant warehouse #, not the mongodb _id property) of the plant to fetch
  // returns promise w/ number equal to inventory of the part at the given plant
  // tests: NOT DONE
  plantService.getInventory = function(part, plant) {
    var fullPath = ApiPath + '/inventory';
    return $http.post(fullPath, {part, plant}).then( function (result) {
      return Promise.resolve(result.data.inventory);
    })
  }

  //**********************************
  // getInventoryArray(parts, plantid)
  //**********************************
  // @param parts - array of part #s item we are trying to determine the inventory on
  // @param plant - id (as in plant warehouse #, not the mongodb _id property) of the plant to fetch
  // returns promise w/ number equal to inventory of the part at the given plant
  // tests: NOT DONE
  plantService.getInventoryArray = function(parts, plant) {
    var promises = [];
    parts.forEach( function (part) {
      promises.push(plantService.getInventory(part, plant));
    });
    return $q.all(promises);
  };

  //*************************************************************
  // postProduction(part, quantity, plant, date)
  //*************************************************************
  // @param part - part # of item produced
  // @param productionType "production" for actual production, "adjustment" for inventory adjustment
  // @param quantity - quantity produced or adjusted
  // @param plant - plant where production/adjustment occurs
  // @param date - date of transaction
  // returns promise w/ production document or an error
  // tests: NOT DONE
  plantService.postProduction = function(part, quantity, plant, date) {
    var fullPath = ApiPath + '/production';
    return $http.post(fullPath, {part, productionType: "production", quantity, plant, date}).then( function (result) {
      return Promise.resolve(result.body);
    })
  }

  //*************************************************************
  // adjustInventory(part, quantity, plant, date)
  //*************************************************************
  // @param part - part # of item produced
  // @param productionType "production" for actual production, "adjustment" for inventory adjustment
  // @param quantity - quantity produced or adjusted
  // @param plant - plant where production/adjustment occurs
  // @param date - date of transaction
  // returns promise w/ production document or an error
  // tests: NOT DONE
  plantService.adjustInventory = function(part, quantity, plant, date) {
    var fullPath = ApiPath + '/production';
    return $http.post(fullPath, {part, productionType: "adjustment", quantity, plant, date}).then( function (result) {
      return Promise.resolve(result.body);
    });
  }

  //*****************************
  //       Helper functions
  //*****************************

  //*****************************
  //      fetchPlant (id)
  //*****************************
  // @param plantid - plant id (whse #, not mongodb _id) of the plant to fetch
  // grab the plant from API, attach lines to the plant object, then attach orders to the line objects
  // save plant to the service, broadcast, and return the plant wrapped in a promise
  // tests: NOT DONE
  var fetchPlant = function (id) {
    var fullPath = ApiPath + '/plants/' + id;
    return $http.get(fullPath)
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

  //*********************************
  // getFloaters (scheduled, orders)
  //*********************************
  // ** DOESNT SORT YET ** MAKE IT SORT
  // @param scheduled -
  // @param orders -
  // take in array of scheduled orders and all open orders
  // return array of unscheduled order ids, sorted by order due dates
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
    plant.lines.forEach( function (line, index) {
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
    $rootScope.$broadcast( 'namespace:plantinfo', {plants: plants});
  };

  // listened to by agileboard controller
  var broadcastUpdateBoard = function () {
    $rootScope.$broadcast( 'namespace:updateboard', {});
  };

  // intent is to notify the order card containing this order that it's underlying order has changed and it needs to re-update
  var broadcastUpdateOrder = function (order) {
    $rootScope.$broadcast( 'namespace:order:' + order._id, {order: order});
  };

}; // End Plant Service



})();
