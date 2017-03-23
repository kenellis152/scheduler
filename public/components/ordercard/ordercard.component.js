(function () {
'use strict';

angular.module('scheduler')
.component('orderCard', {
  templateUrl: 'components/ordercard/ordercard.component.html',
  bindings: {
    orderid: '='
  },
  controller: orderCardController
});

orderCardController.$inject = ['OrdersService'];
function orderCardController (OrdersService) {
  var $ctrl = this;
  this.order = OrdersService.getOrderById(this.orderid);
}


})();
