(function () {
'use strict';

angular.module('scheduler')
.component('orderCard', {
  templateUrl: 'components/ordercard/ordercard.component.html',
  bindings: {
    order: '<',
    resolve: '<'
  },
  controller: orderCardController
});

orderCardController.$inject = ['SpecService'];
function orderCardController (SpecService) {
  var $ctrl = this;
  $ctrl.spec = {};
  $ctrl.order.date = moment($ctrl.order.dueDate).format('MMMM D');
  $ctrl.palletQty = Math.round($ctrl.order.quantity / $ctrl.spec.palletCount);

  this.$onInit = SpecService.getSpecByPart($ctrl.order.part).then( function (result) {
      $ctrl.spec = result.spec;
      $ctrl.updateClasses();
  });

  $ctrl.updateClasses = function () {
    switch($ctrl.spec.speed) {
      case "10":
        $ctrl.speedClass = "tenspeed";
        break;
      case "50":
        $ctrl.speedClass = "fiftyspeed";
        break;
      case "35":
      case "40":
        $ctrl.speedClass = "thirtyfivespeed";
        break;
      case "5":
        $ctrl.speedClass = "fivespeed";
        break;
      case "20":
        $ctrl.speedClass = "twentyspeed";
        break;
    }
  }

}



})();
