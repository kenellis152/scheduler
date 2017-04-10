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
  agileBoard.$inject = ['$scope', 'PlantService', 'OrdersService', 'SelectionService'];
  function agileBoard($scope, PlantService, OrdersService, SelectionService) {
      var $ctrl = this;
      $scope.lines = []; // for .connectWith to connect the separate ui-sortable lists
      $ctrl.changes = {}; // stores local changes to be saved if user decides to save
      $ctrl.linenames = []; // convoluted, but for some reason if i referenced $ctrl.order.lines[$index].name
                            // on the controller, the line name would show on initial load, but not after changing pages
      $ctrl.orderSelected = false;
      $ctrl.loginStatus = false;

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

      var updateBoard = $scope.$on('namespace:updateboard', $ctrl.updateBoard);
      var toggleSelected = $scope.$on('namespace:toggleSelected', function () {
        $ctrl.orderSelected = !$ctrl.orderSelected;
      });
      var loginStatus = $scope.$on('namespace:loginStatus', function (event, data) {
        $ctrl.loginStatus = data.status;
        console.log('login', data);
      });

      $ctrl.$onDestroy = function () {
        updateBoard();
        toggleSelected();
        loginStatus();
      }


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

      $ctrl.revert = function () {
        console.log('calling');
        $ctrl.updateBoard();
      }

  } //end agileBoard

})();
