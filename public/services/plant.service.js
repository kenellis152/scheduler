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
      { _id: 1, plant: 1, active: true, largeDiam: false, toospeedie: false, orders: ['58cf3995ec1bba2facc57531', '58cf39e85588642ca82c4b5f'] },
      { _id: 2, plant: 1, active: true, largeDiam: true, toospeedie: false, orders: ['58d0997d7d641b064036f4ac', '58d31e1d6e64232ce88218fd'] },
      { _id: 3, plant: 1, active: false, largeDiam: false, toospeedie: false, orders: [] },
      { _id: 4, plant: 1, active: false, largeDiam: true, toospeedie: false, orders: ['58d31e296e64232ce88218fe'] }
    ]
  }];

  OrdersService.getOrderById('58cf3995ec1bba2facc57531').then( function (response) {
    // console.log('order by id test', response);
  })

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

  plantService.createOrder = function (order) {
    OrdersService.addOrder(order).then( function(response) {
      if (response._id) {
        plantService.currentState.plants[0].lines[3].orders.push(response._id);
        console.log(response);
      }
    });
  }

  plantService.currentState.orders = OrdersService.getOrders();

  plantService.getState = function () {
    return plantService.currentState;
  }




} // End Plant Service



})();
