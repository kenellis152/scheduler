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
    $ctrl.params = _.pick($ctrl.order, ['_id', 'part', 'quantity', 'coNumber', 'shipTo', 'plant', 'comments', 'stock', 'cancelled', 'cancelledReason']);
    if(!$ctrl.params.stock) {
      $ctrl.params.dueDate = new moment($ctrl.order.dueDate).toDate();
    }
  });

  //get current order details whenever an order is selected
  $scope.$on('namespace:selectedOrder', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
  });

  $ctrl.submit = function() {
    //this flag denotes whether the lines need to be updated (if the order is cancelled or the plant has changed)
    var updateLines = $ctrl.params.cancelled || ($ctrl.params.plant !== $ctrl.order.plant);
    if (updateLines) console.log('order changed or cancelled - deleting from current view');
    OrdersService.changeOrder($ctrl.params, updateLines).then( function(order) {
      PlantService.updateOrder(order, updateLines);
    }).catch( function (err) {

    });
    $('#changeOrderModal').modal('toggle');
  } // End Submit

  $ctrl.validate = function () {
    console.log('validating');
  }

}

})();
