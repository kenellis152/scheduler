(function () {
'use strict';

angular.module('scheduler')
.component('agileBoard', {
  templateUrl: 'components/agileboard/agileboard.component.html',
  controller: agileBoard,

  // controllerAs: agileCtrl
});

/**
 * agileBoard - Controller for agile Board view
 */
  agileBoard.$inject = ['$scope', 'PlantService'];
  function agileBoard($scope, PlantService) {
      this.test = 'Line 1 Orders';
      this.currentState = PlantService.getState();
      $scope.lines = [];

      this.currentState.plants[0].lines.forEach( (element) => {
        console.log(element);
        $scope.lines.push(element.orders);
      });

      $scope.sortableOptions = {
          connectWith: ".connectList"
      };

  } //end agileBoard

})();
