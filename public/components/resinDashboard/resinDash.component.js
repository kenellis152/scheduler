(function () {
'use strict';

angular.module('scheduler')
.component('resinDash', {
  templateUrl: 'components/resinDashboard/resinDash.component.html',
  bindings: {
    plant: '<'
  },
  controller: resinDashController
});

resinDashController.$inject = ['$scope'];
function resinDashController ($scope) {
  var $ctrl = this;
  $ctrl.id = 0;


  $scope.$on('namespace:changeOrderDetail', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
    $ctrl.loadWeight = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount * $ctrl.spec.palletWeight);
  });

  $scope.$on('namespace:plantinfo', function (event, data) {
    $ctrl.plant = data.plants[1];
  });


}

})();
