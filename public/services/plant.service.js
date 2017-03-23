(function () {
"use strict";

angular.module('scheduler')
.service('PlantService', PlantService);

// '$http', 'ApiPath'
PlantService.$inject = ['OrdersService'];
function PlantService(OrdersService) {
  var plantService = this;
  plantService.currentState = {};
  plantService.currentState.plants = [{
    name: 'Georgetown',
    id: 1,
    numlines: 4,
    lines: [
      { _id: 1, plant: 1, active: true, largeDiam: false, toospeedie: false, orders: [0, 2] },
      { _id: 2, plant: 1, active: true, largeDiam: true, toospeedie: false, orders: [3, 4] },
      { _id: 3, plant: 1, active: false, largeDiam: false, toospeedie: false, orders: [5] },
      { id: 4, plant: 1, active: false, largeDiam: true, toospeedie: false, orders: [1, 6] }
    ]
  }];

  //*****************************
  // GET OPEN ORDERS, INIT LINE STATES
  //*****************************
  OrdersService.getOpenOrders().then( function (response) {
    plantService.openOrders = response;
    return response;
  }).then( function(response) {
    console.log('plant service open orders', plantService.openOrders);
    // INITIALIZE PLANT STATES HERE, HAVING RETRIEVED OPEN ORDERS


  });

  plantService.currentState.orders = OrdersService.getOrders();

  plantService.getState = () => {
    return plantService.currentState;
  }




}



})();
