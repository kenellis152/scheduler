(function () {
'use strict';

angular.module('scheduler')
.component('changeOrder', {
  templateUrl: 'components/modals/changeOrder/changeOrder.component.html',
  controller: changeOrderController
});

changeOrderController.$inject = ['OrdersService', 'PlantService', '$scope']
function changeOrderController (OrdersService, PlantService, $scope) {
  var $ctrl = this;
  $ctrl.mindate = new Date();

  $('#changeOrderModal').on('shown.bs.modal', function() {
    $('[autofocus]').focus();
    $ctrl.params = _.pick($ctrl.order, ['_id', 'part', 'quantity', 'coNumber', 'shipTo', 'plant', 'comments', 'stock']);
    if(!$ctrl.params.stock) {
      $ctrl.params.dueDate = new moment($ctrl.order.dueDate).toDate();
    }
    // don't forget to include cancelled and cancelledReason
  });

  //get current order details whenever an order is selected
  $scope.$on('namespace:selectedOrder', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
  });

  $ctrl.submit = function() {
    OrdersService.changeOrder($ctrl.params).then( function(order) {
      PlantService.updateOrder(order);
    }).catch( function (err) {

    });
    $('#changeOrderModal').modal('toggle');
  } // End Submit

  $ctrl.validate = function () {
    console.log('validating');
  }

}

})();
