(function () {
'use strict';

angular.module('scheduler')
.component('newOrder', {
  templateUrl: 'components/modals/newOrder/newOrder.component.html',
  bindings: {
    add: '&',
    plant: '<'
  },
  controller: newOrderController
});

newOrderController.$inject = ['SpecService']
function newOrderController (SpecService) {
  var $ctrl = this;
  $ctrl.mindate = new Date();

  $('#addOrderModal').on('shown.bs.modal', function() {
    $('[autofocus]').focus();
  });

  $ctrl.submit = function() {
    var order = {
      part: $ctrl.part,
      date: $ctrl.date,
      coNumber: $ctrl.coNumber,
      quantity: $ctrl.quantity,
      shipTo: $ctrl.shipTo,
      comments: $ctrl.comments,
      plant: $ctrl.plant,
      stock: $ctrl.stock,
      createDate: new Date()
    }
    console.log(order);
    $ctrl.add({order});
    $ctrl.part = "";
    $ctrl.date = "";
    $ctrl.coNumber = "";
    $ctrl.quantity = "";
    $ctrl.shipTo = "";
    $ctrl.comments = "";
    $ctrl.shipTo = "";
    $('#addOrderModal').modal('toggle');
  } // End Submit

  $ctrl.validate = function () {
    console.log('validating');
  }

}

})();
