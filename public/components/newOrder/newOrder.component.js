(function () {
'use strict';

angular.module('scheduler')
.component('newOrder', {
  templateUrl: 'components/newOrder/newOrder.component.html',
  bindings: {
    add: '&'
  },
  controller: newOrderController
});

newOrderController.$inject = ['SpecService']
function newOrderController (SpecService) {
  var $ctrl = this;
  $ctrl.mindate = new Date();

  $ctrl.submit = function() {
    var order = {
      part: $ctrl.part,
      date: $ctrl.date,
      coNumber: $ctrl.coNumber,
      quantity: $ctrl.quantity
    }
    $ctrl.add({order});
    $ctrl.part = "";
    $ctrl.date = "";
    $ctrl.coNumber = "";
    $ctrl.quantity = "";
    $ctrl.comments = "";
    $ctrl.shipTo = "";
    $('#addOrderModal').modal('toggle');
  } // End Submit

}

})();
