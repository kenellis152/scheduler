(function () {
'use strict';

angular.module('scheduler')
.component('mainDashResin', {
  templateUrl: 'components/mainDash/mainDashResin/mainDashResin.component.html',
  bindings: {
    plant: '<'
  },
  controller: mainDashResinController
});

mainDashResinController.$inject = ['$scope', 'OrdersService', '$timeout'];
function mainDashResinController ($scope, OrdersService, $timeout) {
  var $ctrl = this;

  $ctrl.$onChanges = function (changesObj) {
    if($ctrl.plant) {
      if ($ctrl.plant.openOrders) {
        console.log('updating');
        $timeout(updateBoard, 200);
      }
    }
  }

  var updateBoard = function () {
    $ctrl.fivedayPallets = $ctrl.fivedayLineHours = $ctrl.fivedayPlantHours = $ctrl.fivedayShifts = 0;
    $ctrl.totalPallets = $ctrl.totalLineHours = $ctrl.totalPlantHours = $ctrl.totalShifts = 0;
    $ctrl.inventoryPallets = $ctrl.inventoryLineHours = $ctrl.inventoryPlantHours = $ctrl.inventoryShifts = 0;

    $ctrl.plant.openOrders.forEach (function (order) {
      if (order.dueDate) {
        var daysOut = moment(order.dueDate).diff(moment(), 'days');
      } else {
        var daysOut = 365;
      }
      var runTime = OrdersService.computeRunTime(order);
      if (daysOut <= 7) {
        $ctrl.fivedayPallets += order.quantity / order.spec.palletCount;
        $ctrl.fivedayLineHours += runTime;
      }
      $ctrl.totalPallets += order.quantity / order.spec.palletCount;
      $ctrl.totalLineHours += runTime;
    });
    $ctrl.fivedayPlantHours = Math.round($ctrl.fivedayLineHours / $ctrl.plant.lines.length);
    $ctrl.fivedayShifts = Math.round($ctrl.fivedayPlantHours * 10 / $ctrl.plant.shiftHours) / 10;
    $ctrl.totalPlantHours = Math.round($ctrl.totalLineHours / $ctrl.plant.lines.length);
    $ctrl.totalShifts = Math.round($ctrl.totalPlantHours * 10 / $ctrl.plant.shiftHours) / 10;
    $ctrl.fivedayLineHours = Math.round($ctrl.fivedayLineHours);
    $ctrl.totalLineHours = Math.round($ctrl.fivedayLineHours);
  }


}

})();
