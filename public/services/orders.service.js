(function () {
"use strict";

angular.module('scheduler')
.service('OrdersService', OrdersService);

OrdersService.$inject = ['$http', 'ApiPath', 'SpecService'];
function OrdersService($http, ApiPath) {
  var service = this;

  service.getOpenOrders = function () {
    return $http.get(ApiPath + '/orders/open').then(function (response) {
      service.openOrders = response.data;
      // console.log(response.data);
      return response.data;
    });
  };

  service.getOrders = function () {
    return service.orders;
  };

  service.getOrderById = function(id) {
    return $http.get(ApiPath + `/orders/${id}`).then( function (response) {
      return response.data;
    });
  };

  service.addOrder = function (order) {
    return $http.post(ApiPath + '/orders/', order).then( function (response) {
      return response.data;
    });
  };


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
