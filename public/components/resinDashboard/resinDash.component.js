(function () {
'use strict';

angular.module('scheduler')
.component('resinDash', {
  templateUrl: 'components/resinDashboard/resinDash.component.html',
  bindings: {
    plantid: '<'
  },
  controller: resinDashController
});

resinDashController.$inject = ['$scope', 'OrdersService'];
function resinDashController ($scope, OrdersService) {
  var $ctrl = this;
  $ctrl.id = 0;

  $scope.$on('namespace:changeOrderDetail', function (event, data) {
    $ctrl.order = data.order;
    $ctrl.spec = data.spec;
    $ctrl.loadWeight = Math.floor($ctrl.order.quantity / $ctrl.spec.palletCount * $ctrl.spec.palletWeight);
  });

  $scope.$on('namespace:plantinfo', function (event, data) {
    $ctrl.plant = data.plants[$ctrl.plantid];
    $ctrl.updateDash();
  });

  $ctrl.updateDash = function () {

  };

  var data1 = [
    [-8, 4],
    [-7, 8],
    [-6, 5],
    [-5, 10],
    [-4, 4],
    [-3, 16],
    [-2, 5],
    [-1, 11],
    [0, 6],
    [1, 11],
    [2, 30],
    [3, 10],
    [4, 13],
    [5, 4],
    [6, 3],
    [7, 3],
    [8, 6]
];
var data2 = [
    [-8, 1],
    [-7, 0],
    [-6, 2],
    [-5, 0],
    [-4, 1],
    [-3, 3],
    [-2, 1],
    [-1, 5],
    [0, 2],
    [1, 3],
    [2, 2],
    [3, 1],
    [4, 0],
    [5, 2],
    [6, 8],
    [7, 0],
    [8, 0]
];

var options = {
    series: {
        lines: {
            show: false,
            fill: true
        },
        splines: {
            show: true,
            tension: 0.4,
            lineWidth: 1,
            fill: 0.4
        },
        points: {
            radius: 0,
            show: true
        },
        shadowSize: 2,
        grow: {stepMode:"linear",stepDirection:"up",steps:80}
    },
    grow: {stepMode:"linear",stepDirection:"up",steps:80},
    grid: {
        hoverable: true,
        clickable: true,
        tickColor: "#d5d5d5",
        borderWidth: 1,
        color: '#d5d5d5'
    },
    colors: ["#1ab394", "#1C84C6"],
    xaxis: {
    },
    yaxis: {
        ticks: 4
    },
    tooltip: false
};

/**
 * Definition of variables
 * Flot chart
 */
$ctrl.flotData = [data1, data2];
$ctrl.flotOptions = options;

}

})();
