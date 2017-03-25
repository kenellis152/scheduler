(function () {
'use strict';

angular.module('scheduler')
.component('agileBoard', {
  templateUrl: 'components/agileboard/agileboard.component.html',
  controller: agileBoard
});

/**
 * agileBoard - Controller for agile Board view
 */
  agileBoard.$inject = ['$scope', 'PlantService'];
  function agileBoard($scope, PlantService) {

      var $ctrl = this;
      $scope.lines = []; // for .connectWith to connect the separate ui-sortable lists
      $ctrl.changes = {}; // stores local changes to be saved if user decides to save

      $ctrl.$onInit = PlantService.getPlant(1).then( function (result) {
        $ctrl.plant = result;
        console.log($ctrl.plant);
        $ctrl.plant.lines.forEach( (element) => {
          $scope.lines.push(element.orders);
        });
        $scope.sortableOptions = {
            connectWith: ".connectList"
        };
      });


      // Takes an order object and adds it to the database
      // Called by the "newOrder" component when the button is clicked
      $ctrl.addOrder = function (order) {
        PlantService.createOrder(order);
      }

  } //end agileBoard

})();
