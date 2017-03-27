(function () {
'use strict';

angular.module('scheduler')
.component('agileBoard', {
  templateUrl: 'components/agileboard/agileboard.component.html',
  controller: agileBoard,
  bindings: {
    plant: '<',
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


      $ctrl.$onInit = PlantService.getPlant($ctrl.plant).then( function (result) {
        $ctrl.plant = result;
        // console.log($ctrl.plant.id);
        // console.log($ctrl.plant.lines[1].name);
        $ctrl.plant.lines.forEach( (element) => {
          $scope.lines.push(element.orders);
          $ctrl.linenames.push(element.name);
        });
        $scope.sortableOptions = {
            connectWith: ".connectList"
        };
      }).catch( function(plant) {
        console.log('catastrophic error with agileboard loading plant')
      });


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
