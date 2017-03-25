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
      this.test = 'Line 1 Orders';
      this.currentState = PlantService.getState();
      $scope.lines = [];
      $scope.test1 = 'asdf';
      this.currentState.plants[0].lines.forEach( (element) => {
        $scope.lines.push(element.orders);
      });

      $scope.sortableOptions = {
          connectWith: ".connectList"
      };

      this.addOrder = function (order) {
        // console.log ('going to add this order', order);
        PlantService.createOrder(order);
      }

  } //end agileBoard

})();
