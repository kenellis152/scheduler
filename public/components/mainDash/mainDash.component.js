(function () {
'use strict';

angular.module('scheduler')
.component('mainDash', {
  templateUrl: 'components/mainDash/mainDash.component.html',
  controller: mainDashController
});

mainDashController.$inject = ['$scope', 'PlantService', 'OrdersService', 'Session', '$q', 'SpecService', '$rootScope'];
function mainDashController ($scope, PlantService, OrdersService, Session, $q, SpecService) {
  var $ctrl = this;
  $ctrl.loginStatus = Session.getLoginStatus();
  $ctrl.loading = false;
  $ctrl.plants = [];
  $ctrl.openOrders = [];
  $ctrl.history = [];

  $ctrl.$onInit = function () {
    $ctrl.loading = true;
    var promises = [];
    promises[0] = PlantService.getPlantInfo(1);
    promises[1] = PlantService.getPlantInfo(2);
    promises[2] = OrdersService.getOpenOrders(1);
    promises[3] = OrdersService.getOpenOrders(2);
    promises[4] = OrdersService.getEightWeekDemandHistory(1);
    promises[5] = OrdersService.getEightWeekDemandHistory(2);
    $q.all(promises).then( function (results) {
      // var tempplants = [];
      $ctrl.plants[1] = results[0].data.plant;
      $ctrl.plants[2] = results[1].data.plant;
      $ctrl.plants[1].openOrders = results[2];
      $ctrl.plants[2].openOrders = results[3];

      // var plant1StockItems, plant2StockItems;
      // $ctrl.plants[1].stockItems.forEach()

      var newpromises = [];
      newpromises[0] = SpecService.addSpecsToOrdersArray($ctrl.plants[1].openOrders);
      newpromises[1] = SpecService.addSpecsToOrdersArray($ctrl.plants[2].openOrders);
      newpromises[2] = SpecService.addSpecsToOrdersArray(results[4]);
      newpromises[3] = SpecService.addSpecsToOrdersArray(results[5]);
      newpromises[4] = SpecService.addSpecsToOrdersArray($ctrl.plants[1].stockItems);
      newpromises[5] = SpecService.addSpecsToOrdersArray($ctrl.plants[2].stockItems);
      newpromises[4] = PlantSe rvice.getInventoryArray($ctrl.plants[1].stockItems);
      return $q.all(newpromises)
    }).then( function (results) {
      $ctrl.loading = false;
      $scope.$broadcast('mainDash:plantsLoaded');
      $ctrl.history[0] = results[2];
      $ctrl.history[1] = results[3];
      //attach specs to the stock items
      // $ctrl.plants[1].stockItems.forEach ( function (item) {
      //   // $ctrl.plant.stockItems[i].spec = results[0][i],
      //   results[4].forEach( function (spec) {
      //     if (spec.part === item.part) {
      //       item.spec = spec;
      //     }
      //   });
      //   $ctrl.plant.stockItems[i].inventory = results[1][i];
      // });
    }).catch( function (error) {
      console.log('failed to initialize main dashboard', error);
    });
  }
  //
  // var processOrderHistory = function (orders) {
  //   $ctrl.history[1] = [];
  //   $ctrl.history[2] = [];
  //   orders.forEach( function (order) {
  //     if (order.plant === 1 || order.plant === 2) {
  //       $ctrl.history[order.plant].push(order);
  //     }
  //   });
  // }

}

})();
