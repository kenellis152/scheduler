(function () {
'use strict';

angular.module('scheduler')
.component('orderCard', {
  templateUrl: 'components/ordercard/ordercard.component.html',
  bindings: {
    orderid: '=',
    resolve: '<'
  },
  controller: orderCardController
});

orderCardController.$inject = ['OrdersService'];
function orderCardController (OrdersService) {
  var $ctrl = this;

  this.$onInit = OrdersService.getOrderById(this.orderid).then( function (order) {
      $ctrl.order = order;
      $ctrl.order.date = moment($ctrl.order.dueDate).format('MMMM D');
      // console.log($ctrl.order);
  });
}


})();
