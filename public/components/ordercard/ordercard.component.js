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

orderCardController.$inject = ['SpecService', 'SelectionService', '$scope'];
function orderCardController (SpecService, SelectionService, $scope) {
  var $ctrl = this;
  $ctrl.spec = {};

  this.$onInit = SpecService.getSpecByPart($ctrl.order.part).then( function (result) {
      $ctrl.spec = result.spec;
      $ctrl.order.spec = result.spec;
      if( SelectionService.getSelected() === $ctrl.order._id ) {$ctrl.clickProcess();}
      $ctrl.updateCard();
  }); // End $onInit()

  $ctrl.$onDestroy = function () {
    idwatcher();
  }

  $ctrl.clickProcess = function () {
    SelectionService.clickProcess($ctrl.order._id, $ctrl.order, $ctrl.spec)
  };// End clickProcess()

  var watchername = 'namespace:order:' + $ctrl.order._id;
  var idwatcher = $scope.$on(watchername, function() {
    $ctrl.spec = $ctrl.order.spec;
    $ctrl.updateCard();
  });

  $ctrl.updateCard = function () {
    if (!$ctrl.order.stock) {
      $ctrl.order.date = moment($ctrl.order.dueDate).format('MMM D, ddd');
      var daysOut = moment($ctrl.order.dueDate).diff(moment(), 'days');
      if (daysOut < 3) {
        $ctrl.dueSoon = "duesoon";
      } else {
        $ctrl.dueSoon = "";
      }
    } else {
      $ctrl.order.date = "stock";
      $ctrl.dueSoon = "stock";
    }

    switch($ctrl.order.spec.speed) {
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
      case "204":
      case "90":
        $ctrl.speedClass = "slowspeed";
        break;
    }// end speed switch

    //create order quantity string
    $ctrl.plts = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount);
    $ctrl.bxs = Math.floor(($ctrl.order.quantity - $ctrl.plts * $ctrl.spec.palletCount) / $ctrl.spec.piecesPerBundle);
    $ctrl.pcs = ($ctrl.order.quantity - $ctrl.plts * $ctrl.spec.palletCount - $ctrl.bxs * $ctrl.spec.piecesPerBundle);
    $ctrl.quantityString = "";
    if($ctrl.plts) {$ctrl.quantityString += $ctrl.plts + ' plts ';}
    if($ctrl.bxs && $ctrl.spec.boxSw[0] === 'B') {$ctrl.quantityString += $ctrl.bxs + ' bxs ';}
    else if ($ctrl.bxs) {$ctrl.quantityString += $ctrl.bxs + ' bndl ';}
    if($ctrl.pcs) {$ctrl.quantityString += $ctrl.pcs + ' pcs';}

  }// end update card function

}// end orderCardControll



})();
