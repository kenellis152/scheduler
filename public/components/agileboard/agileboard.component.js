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
  agileBoard.$inject = ['$scope', 'PlantService', 'OrdersService', 'SelectionService', 'Session', '$rootScope'];
  function agileBoard($scope, PlantService, OrdersService, SelectionService, Session, $rootScope) {
      var $ctrl = this;
      $scope.lines = []; // for .connectWith to connect the separate ui-sortable lists
      $ctrl.changes = {}; // stores local changes to be saved if user decides to save
      $ctrl.linenames = []; // convoluted, but for some reason if i referenced $ctrl.order.lines[$index].name
                            // on the controller, the line name would show on initial load, but not after changing pages

      $ctrl.loginStatus = Session.getLoginStatus();
      $ctrl.loading = false;

      $ctrl.updateBoard = function () {
        $ctrl.loading = true;
        $ctrl.orderSelected = false;
        SelectionService.clearSelected();
        PlantService.getPlant($ctrl.plantid).then( function (result) {
          $scope.lines = []; $ctrl.changes = {}; $ctrl.linenames = [];
          $ctrl.plant = result;
          $ctrl.plant.lines.forEach( function (element) {
            $scope.lines.push(element.orders);
            $ctrl.linenames.push(element.name);
          });
          $scope.sortableOptions = {
              connectWith: ".connectList",
              update: function () {
                $rootScope.$broadcast('sortable:update');
              }
          };
          $ctrl.loading = false;
        }).catch( function(plant) {
          $ctrl.loading = false;
          console.log('catastrophic error with agileboard loading plant', plant)
        });
      }

      $ctrl.$onInit = function () {
        $ctrl.updateBoard();
      }

      var updateBoardWatcher = $scope.$on('namespace:updateboard', $ctrl.updateBoard);
      var toggleSelected = $scope.$on('namespace:toggleSelected', function () {
        $ctrl.orderSelected = !$ctrl.orderSelected;
      });
      var loginStatus = $scope.$on('namespace:loginStatus', function (event, data) {
        $ctrl.loginStatus = data.status;
        console.log('login', data);
      });

      $ctrl.$onDestroy = function () {
        updateBoardWatcher();
        toggleSelected();
        loginStatus();
      }


      // Takes an order object and adds it to the database
      // Called by the "newOrder" component when the button is clicked
      $ctrl.addOrder = function (neworder) {
        OrdersService.addOrder(neworder).then( function (result) {
            console.log("add order result", result);
            PlantService.addOrder(result);
        }).catch( function (e) {
          console.log(e);
        });
      }

      $ctrl.revert = function () {
        $ctrl.updateBoard();
      }

  } //end agileBoard

})();
