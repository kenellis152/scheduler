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

  // $ctrl.$onChanges = function (changesObj) {
  //   console.log($ctrl.plant);
  //   if($ctrl.plant) {
  //     if ($ctrl.plant.openOrders) {
  //
  //       $timeout(updateBoard, 200);
  //     }
  //   }
  // }

  $ctrl.$onDestroy = function () {
    plantsLoadedWatcher();
  }

  var plantsLoadedWatcher = $scope.$on('mainDash:plantsLoaded', function () {
    updateBoard();
  })

  var updateBoard = function () {
    // console.log($ctrl.plant);
    $ctrl.demand = OrdersService.getDemand($ctrl.plant);
  }


}

})();
