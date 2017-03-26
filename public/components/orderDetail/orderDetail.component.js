(function () {
'use strict';

angular.module('scheduler')
.component('orderDetail', {
  templateUrl: 'components/orderDetail/orderDetail.component.html',
  bindings: {
    add: '&'
  },
  controller: orderDetailController
});

orderDetailController.$inject = ['$scope'];
function orderDetailController ($scope) {
  var $ctrl = this;
  $ctrl.id = 0;


  $scope.$on('namespace:changeOrderDetail', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
    $ctrl.loadWeight = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount * $ctrl.spec.palletWeight);
  });

  $scope.$on('namespace:plantinfo', function (event, data) {
    $ctrl.plants = data.plants[1];
  });


}

})();
