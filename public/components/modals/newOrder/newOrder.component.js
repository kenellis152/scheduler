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
    $ctrl.showPart = false;
  });

  $ctrl.submit = function() {
    var order = {
      part: $ctrl.part,
      dueDate: $ctrl.date,
      coNumber: $ctrl.coNumber,
      quantity: $ctrl.quantity,
      shipTo: $ctrl.shipTo,
      comments: $ctrl.comments,
      plant: $ctrl.plant,
      stock: $ctrl.stock,
      createDate: new Date()
    }
    console.log(order);
    $ctrl.add({order: order});
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
    if ( $ctrl.part === null ) {
      $ctrl.showPart = false;
    } else {
      SpecService.getSpecByPart($ctrl.part).then( function (response) {
      console.log(response);
      if (response.spec) {
        $ctrl.spec = response.spec;
        $ctrl.desc = $ctrl.spec.description;
      } else {
        $ctrl.desc = "PART NOT FOUND";
      }
      $ctrl.showPart = true;
    }).catch( function (e) {
      $ctrl.desc = "PART NOT FOUND";
      $ctrl.showPart = true;
    });
  }
    }
}

})();
