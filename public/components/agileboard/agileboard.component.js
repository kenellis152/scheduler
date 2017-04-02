(function () {
'use strict';

angular.module('scheduler')
.component('agileBoard', {
  templateUrl: 'components/agileboard/agileboard.component.html',
  controller: agileBoard,
  bindings: {
    plantid: '<',
  }
});

/**
 * agileBoard - Controller for agile Board view
 */
  agileBoard.$inject = ['$scope', 'PlantService', 'OrdersService'];
  function agileBoard($scope, PlantService, OrdersService) {
      var $ctrl = this;
      $scope.lines = []; // for .connectWith to connect the separate ui-sortable lists
      $ctrl.changes = {}; // stores local changes to be saved if user decides to save
      $ctrl.linenames = []; // convoluted, but for some reason if i referenced $ctrl.order.lines[$index].name
                            // on the controller, the line name would show on initial load, but not after changing pages

      $ctrl.updateBoard = function () {
        PlantService.getPlant($ctrl.plantid).then( function (result) {
          $scope.lines = []; $ctrl.changes = {}; $ctrl.linenames = [];
          $ctrl.plant = result;
          $ctrl.plant.lines.forEach( (element) => {
            $scope.lines.push(element.orders);
            $ctrl.linenames.push(element.name);
          });
          $scope.sortableOptions = {
              connectWith: ".connectList"
          };
        }).catch( function(plant) {
          console.log('catastrophic error with agileboard loading plant', plant)
        });
      }

      $ctrl.$onInit = $ctrl.updateBoard();

      $scope.$on('namespace:updateboard', $ctrl.updateBoard);



      // Takes an order object and adds it to the database
      // Called by the "newOrder" component when the button is clicked
      $ctrl.addOrder = function (neworder) {
        OrdersService.addOrder(neworder).then( (result) => {
            console.log("add order result", result);
            PlantService.addOrder(result);
        }).catch((e) => {
          console.log(e);
        });
      }

  } //end agileBoard

})();
