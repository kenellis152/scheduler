(function () {
'use strict';

angular.module('scheduler')
.component('flotChart', {
  templateUrl: 'components/flot-chart/flotChart.component.html',
  bindings: {
    inputdata: '<'
  },
  controller: flotChartController
});

flotChartController.$inject = ['SpecService', '$scope'];
function flotChartController (SpecService, $scope) {
  var $ctrl = this;

  $ctrl.$onInit = function () {
    if($ctrl.inputdata) {
      updateData();
    }
  }

  $ctrl.$onChanges = function () {
    if($ctrl.inputdata) {
      updateData();
    }
  }

  var updateData = function () {
    $ctrl.data = $ctrl.inputdata;
    $ctrl.flotData = $ctrl.data.data;
    $ctrl.flotOptions = $ctrl.data.options;
  }

}// end orderCardControll



})();
