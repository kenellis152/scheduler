(function () {
'use strict';

angular.module('scheduler')
.component('stockBoard', {
  templateUrl: 'components/stockBoard/stockBoard.component.html',
  bindings: {
    plantid: '<'
  },
  controller: stockBoardController
});

stockBoardController.$inject = ['PlantService', 'SpecService', '$q', '$scope', 'OrdersService'];
function stockBoardController (PlantService, SpecService, $q, $scope, OrdersService) {
  var $ctrl = this;
  $ctrl.stock = [];

  $ctrl.$onChanges = function () {
    updateBoard();
  }

  $ctrl.$onDestroy = function () {
    updateWatcher();
  }

  $ctrl.adjustSelection = function (item) {
    $ctrl.selected = item;
  }

  var updateWatcher = $scope.$on('stockBoard:update', function () {
    updateBoard();
  });

  var updateBoard = function () {
    PlantService.getPlantInfo($ctrl.plantid).then( function (result) {
      $ctrl.plant = result.data.plant;
      return Promise.resolve(result.data.plant);
    }).then( function (result) {
      var promises = []; var stockParts = [];
      result.stockItems.forEach( function (item) {
        stockParts.push(item.part);
      });
      promises[0] = SpecService.getSpecArray(stockParts);
      promises[1] = PlantService.getInventoryArray(stockParts, $ctrl.plantid);
      return $q.all(promises);
    }).then( function (results) {
      // console.log(results);
      for (var i = 0; i < $ctrl.plant.stockItems.length; i++) {
        // $ctrl.plant.stockItems[i].spec = results[0][i],
        results[0].forEach( function (spec) {
          if (spec.part === $ctrl.plant.stockItems[i].part) {
            $ctrl.plant.stockItems[i].spec = spec;
          }
        })
        $ctrl.plant.stockItems[i].inventory = results[1][i];
      };
      OrdersService.updateStockStatus($ctrl.plant);
      // console.log($ctrl.plant.stockItems);
    });
  }

}//end stockBoardController
})();
