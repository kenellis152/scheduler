(function () {
'use strict';

angular.module('scheduler')
.component('orderDetail', {
  templateUrl: 'components/orderDetail/orderDetail.component.html',
  bindings: {
    plant: '<'
  },
  controller: orderDetailController
});

orderDetailController.$inject = ['$scope'];
function orderDetailController ($scope) {
  var $ctrl = this;

  $scope.$on('namespace:selectedOrder', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
    updateValues();
  });

  $scope.$on('namespace:plantinfo', function (event, data) {
    $ctrl.plants = data.plants[$ctrl.plant];
  });

  var updateValues = function() {
    $ctrl.loadWeight = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount * $ctrl.spec.palletWeight);
    if ($ctrl.spec.boxSw === "B") { $ctrl.box = "box"; $ctrl.boxes = "boxes";} else {$ctrl.box = "stretch wrap bundle"; $ctrl.boxes = 'bundles';}

    switch($ctrl.spec.speed) {
      case "10":
        $ctrl.speedClass = "tenspeed";
        break;
      case "50":
        $ctrl.speedClass = "fiftyspeed";
        break;
      case "35":
      case "40":
        $ctrl.speedClass = "thirtyfivespeed";
        break;
      case "5":
        $ctrl.speedClass = "fivespeed";
        break;
      case "20":
        $ctrl.speedClass = "twentyspeed";
        break;
      case "0204":
      case "90":
        $ctrl.speedClass = "slowspeed";
        break;
      }
  }
}

})();
