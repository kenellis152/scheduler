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

stockBoardController.$inject = ['PlantService', 'SpecService', '$q'];
function stockBoardController (PlantService, SpecService, $q) {
  var $ctrl = this;
  $ctrl.stock = [];

  $ctrl.$onChanges = function () {
    updateBoard();
  }

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
        $ctrl.plant.stockItems[i].spec = results[0][i].spec,
        $ctrl.plant.stockItems[i].inventory = results[1][i];
        updateStockStatus($ctrl.plant.stockItems[i]);
      };
      console.log($ctrl.plant.stockItems);
    });
  }

  // attach "stockStatus" property depending on current inventory level
  var updateStockStatus = function (stockItem) {
    stockItem.variance = stockItem.inventory - stockItem.quantity;
    stockItem.stockPercent = stockItem.inventory / stockItem.quantity;
    if (stockItem.variance > 0) stockItem.variance = 0;
    if (stockItem.stockPercent > 100) stockItem.stockPercent = 100;
    if ( stockItem.stockPercent < 20) stockItem.stockStatus = "lowstock";
    if ( stockItem.stockPercent > 20) stockItem.stockStatus = "mediumstock";
    if ( stockItem.stockPercent > 50) stockItem.stockStatus = "goodstock";
    if ( stockItem.stockPercent >= 100) stockItem.stockStatus = "fullstock";

  }

}//end stockBoardController
})();
