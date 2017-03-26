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

orderCardController.$inject = ['SpecService', 'SelectionService'];
function orderCardController (SpecService, SelectionService) {
  var $ctrl = this;
  $ctrl.spec = {};
  $ctrl.order.date = moment($ctrl.order.dueDate).format('MMMM D');
  $ctrl.palletQty = Math.round($ctrl.order.quantity / $ctrl.spec.palletCount);

  this.$onInit = SpecService.getSpecByPart($ctrl.order.part).then( function (result) {
      $ctrl.spec = result.spec;
      $ctrl.order.spec = result.spec;
      if( SelectionService.getSelected() === $ctrl.order._id ) {$ctrl.clickProcess();}
      $ctrl.updateCard();
  }); // End $onInit()

  $ctrl.clickProcess = function () {
    SelectionService.clickProcess($ctrl.order._id, $ctrl.order, $ctrl.spec)
  };// End clickProcess()

  $ctrl.updateCard = function () {
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
      case "0204":
      case "90":
        $ctrl.speedClass = "slowspeed";
        break;
    }// end speed switch

    //create order quantity string
    $ctrl.plts = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount);
    $ctrl.bxs = Math.floor(($ctrl.order.quantity - $ctrl.plts * $ctrl.spec.palletCount) / $ctrl.spec.piecesPerBundle);
    $ctrl.pcs = ($ctrl.order.quantity - $ctrl.plts * $ctrl.spec.palletcount - $ctrl.bxs * $ctrl.spec.piecesPerBundle)
    $ctrl.quantityString = "";
    if($ctrl.plts) {$ctrl.quantityString += $ctrl.plts + ' plts ';}
    if($ctrl.bxs) {$ctrl.quantityString += $ctrl.bxs + ' bxs ';}
    if($ctrl.pcs) {$ctrl.quantityString += $ctrl.pcs + ' pcs';}

  }// end update class function

}// end orderCardControll



})();
