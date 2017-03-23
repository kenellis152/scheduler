(function () {
"use strict";

angular.module('scheduler')
.service('OrdersService', OrdersService);


OrdersService.$inject = ['$http', 'ApiPath'];
function OrdersService($http, ApiPath) {
  var service = this;

  service.orders = [
    { customer: "River View", part: 155075, date: "2/15/17", quantity: 5, id: 0, plant: 1 },
    { customer: "Viper", part: 175052, date: "2/17/17", quantity: 10, id: 1, plant: 1 },
    { customer: "Viper", part: 175091, date: "2/17/17", quantity: 10, id: 2, plant: 1 },
    { customer: "Oaktown", part: 157193, date: "2/13/17", quantity: 5, id: 3, plant: 1 },
    { customer: "Oaktown", part: 181069, date: "2/21/17", quantity: 5, id: 4, plant: 1 },
    { customer: "Francisco", part: 184085, date: "2/23/17", quantity: 5, id: 5, plant: 1 },
    { customer: "Gibson County", part: 284098, date: "2/25/17", quantity: 5, id: 6, plant: 1 },
  ];

  service.getOpenOrders = function () {
    return $http.get(ApiPath + '/orders/open').then(function (response) {
      // console.log(response.data);
      return response.data;
    });
  };


  service.getOrders = function () {
    return service.orders;
  }

  service.getOrderById = function (id) {
    var result;
    service.orders.forEach( (element) => {
      if (element.id == id) {
        result = element;
      }
    });
    if (result) {
      return result;
    }
    console.log('failure');
    return null;
  }

}



})();

//Order Schema
/*
OrderSchema
  part: {type: Number, required: true, minlength: 1,},
  quantity: {type: Number, required: true, minlength: 1},
  plant: {type: Number, default: 1},
  createDate: {type: Date, default: Date.now},
  dueDate: {type: Date, default: Date.now // required: true},
  completed: {type: Boolean, default: false},
  completedDate: {type: Date, default: Date.now},
  customerId: {type: Number},
  shipTo: {type: String},
  cancelled: {type: Boolean},
  cancelledReason: {type: String},
  coNumber: {type: Number, required: true}
});*/
