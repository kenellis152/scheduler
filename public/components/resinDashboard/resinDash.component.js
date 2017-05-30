(function () {
'use strict';

angular.module('scheduler')
.component('resinDash', {
  templateUrl: 'components/resinDashboard/resinDash.component.html',
  bindings: {
    plantid: '<'
  },
  controller: resinDashController
});

resinDashController.$inject = ['$scope', 'OrdersService', 'PlantService', '$q', 'SpecService', '$timeout'];
function resinDashController ($scope, OrdersService, PlantService, $q, SpecService, $timeout) {
  var $ctrl = this;
  $ctrl.id = 0;

  $ctrl.$onDestroy = function () {
    plantInfo();
    listenSortableUpdate();
    updateDash();
  }

  var plantInfo = $scope.$on('namespace:plantinfo', function (event, data) {
    $ctrl.plant = data.plants[$ctrl.plantid];
    $ctrl.demand = OrdersService.getDemand($ctrl.plant);
    $ctrl.updateDash();
  });

  var updateDash = $scope.$on('resinDash:update', function (event, data) {
    $ctrl.plant.shiftHours = data.shiftHours;
    $ctrl.plant.activeShifts = data.activeShifts;
    $ctrl.updateDash();
  });

  // recalculate line hours whenever agile board is changed
  var listenSortableUpdate = $scope.$on('sortable:update', function (event, data) {
    $timeout(getLineHrs, 500);
  });

  $ctrl.updateDash = function () {
    var stockParts = [];
    var promises = [];
    $ctrl.plant.stockItems.forEach( function(item) {
      stockParts.push(item.part);
    });
    promises[0] = SpecService.getSpecArray(stockParts);
    promises[1] = PlantService.getInventoryArray(stockParts, $ctrl.plantid);
    $q.all(promises).then( function (results) {
      for (var i = 0; i < $ctrl.plant.stockItems.length; i++) {
        // $ctrl.plant.stockItems[i].spec = results[0][i],
        // assign each spec to each stock Item
        results[0].forEach( function (spec) {
          if (spec.part === $ctrl.plant.stockItems[i].part) {
            $ctrl.plant.stockItems[i].spec = spec;
          }
        })
        $ctrl.plant.stockItems[i].inventory = results[1][i];
      }
      OrdersService.updateStockStatus($ctrl.plant);

      getLineHrs();

    }); // end $q.all
  };

  var getLineHrs = function () {
    // calculate scheduled hours for each line
    // also estimates, for each order, if it will be late or not (WORK IN PROGRESS)
    // CSS style for late order: // order.lateStyle = 'border-style: solid; border-width: medium; border-color: red;';
    $ctrl.lineHrs = [];
    for (var i = 0; i < 4; i++) {
      var totalHrs = 0;
      $ctrl.plant.lines[i].orders.forEach( function (order) {
        totalHrs += OrdersService.computeRunTime(order);
      });
      $ctrl.lineHrs[i] = totalHrs;

    }
  }

}

})();
