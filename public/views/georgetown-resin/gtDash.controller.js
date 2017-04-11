(function () {
'use strict';

angular.module('scheduler')
.controller('gtDashController', gtDashController);

gtDashController.$inject = ['$scope'];
function gtDashController ($scope) {
  var $ctrl = this;

  $scope.$on('namespace:changeOrderDetail', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
    $ctrl.loadWeight = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount * $ctrl.spec.palletWeight);
  });

  $scope.$on('namespace:plantinfo', function (event, data) {
    $ctrl.plants = data.plants[$ctrl.plant];
  });


}

})();
