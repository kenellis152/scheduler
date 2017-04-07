(function () {
'use strict';

angular.module('scheduler')
.component('recordProduction', {
  templateUrl: 'components/modals/recordProduction/recordProduction.component.html',
  controller: recordProductionController
});

recordProductionController.$inject = ['OrdersService', 'PlantService', '$scope']
function recordProductionController (OrdersService, PlantService, $scope) {
  var $ctrl = this;
  $ctrl.mindate = new Date();

  var recordProductionModal = $('#recordProductionModal').on('shown.bs.modal', function() {
    $ctrl.params = _.pick($ctrl.order, ['_id', 'part', 'quantity', 'coNumber', 'shipTo', 'plant', 'produced', 'stock', 'dueDate']);
    //checkbox for order completed defaults to true
    $ctrl.params.completed = true;

    if(!$ctrl.params.stock) {
      $ctrl.dueDate = new moment($ctrl.params.dueDate).format("dddd MMM Do");
    } else { $ctrl.dueDate = "stock" }

    //quantity produced defaults to amount required to complete the order
    if ($ctrl.params.produced) {
      $ctrl.params.quantityProduced = $ctrl.params.quantity - $ctrl.params.produced;
    } else {
      $ctrl.params.quantityProduced = $ctrl.params.quantity;
      // change produced to 0 so it can be used upon order submission (otherwise it will be NaN and bug out arithmetic operations)
      $ctrl.params.produced = 0;
    }
  });

  //get current order details whenever an order is selected
  var selectedOrder = $scope.$on('namespace:selectedOrder', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
  });

  $ctrl.submit = function() {
    if ($ctrl.params.completed) {
      // params.date just stores the date from form, but the API will be looking for 'completedDate', not date
      // done like this so that completedDate will only be submitted if completed is set to true
      $ctrl.params.completedDate = $ctrl.params.date;
    }
    OrdersService.changeOrder($ctrl.params, $ctrl.params.completed).then( function(order) {
      PlantService.updateOrder(order, $ctrl.params.completed);
    }).catch( function (err) {
    });
    $('#recordProductionModal').modal('toggle');
  } // End Submit

  $ctrl.validate = function () {
    console.log('validating');
  }

  // Clean up listeners
  $ctrl.$onDestroy = function () {
    selectedOrder();
    recordProductionModal();
  }

}

})();
