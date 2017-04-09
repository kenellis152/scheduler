(function () {
'use strict';

angular.module('scheduler')
.component('login', {
  templateUrl: 'components/modals/login/login.component.html',
  bindings: {
    add: '&',
    plant: '<'
  },
  controller: loginController
});

loginController.$inject = ['SpecService']
function loginController (SpecService) {
  var $ctrl = this;
  $ctrl.mindate = new Date();

  $('#loginModal').on('shown.bs.modal', function() {
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
