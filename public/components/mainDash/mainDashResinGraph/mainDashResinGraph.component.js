(function () {
'use strict';

angular.module('scheduler')
.component('mainDashResinGraph', {
  templateUrl: 'components/mainDash/mainDashResinGraph/mainDashResinGraph.component.html',
  bindings: {
    orders: '<'
  },
  controller: mainDashResinGraphController
});

mainDashResinGraphController.$inject = ['$scope', 'OrdersService', '$timeout'];
function mainDashResinGraphController ($scope, OrdersService, $timeout) {
  var $ctrl = this;

  $ctrl.$onChanges = function () {
    if ($ctrl.orders) {
      updateData();
    }
  }

  var updateData = function () {
    // get data
    var pallets = [0,0,0,0,0,0,0,0,0,0,0]; // 0 index corresponds to startDate, i index corresponds to startDate - i weeks
    var hours = [0,0,0,0,0,0,0,0,0,0,0];
    startDate = getStartDate();

    // console.log($ctrl.orders);
    var newpallets
    // set x axes labels
    var startDate = getStartDate();
    for (var i = 0; i < 9; i++) {
      options.xaxis.ticks.push([0-i, startDate.format('MMM Do')]);
      startDate.subtract(1, 'weeks');
    }

    $ctrl.orders.forEach(function (order) {
      //first determine the appropriate index
      // var daysAgo = startDate.diff(moment(order.dueDate), 'days');
      var index = getDataIndex(order.dueDate);
      // var index = Math.floor((daysAgo+7) / 7);
      if(index > 8 || index < 0 ) console.log(index);
      // console.log(typeof (order.quantity / order.spec.palletCount), typeof (pallets[index] + newpallets));
      if ( order.spec && order.spec.palletCount ) {newpallets = order.quantity / order.spec.palletCount;
      pallets[index] = pallets[index] + newpallets;}
      hours[index] = hours[index] + OrdersService.computeRunTime(order);
    });

    for (var i = 0; i < 9; i++) {
      data1[i][1] = pallets[i];
      data2[i][1] = hours[i];
    }

    $ctrl.flotData = [data1, data2];
    $ctrl.flotOptions = options;
    $ctrl.data = {data: $ctrl.flotData, options: $ctrl.flotOptions};
  } // end updateData();


  //*****************************
  //       getStartDate()
  //*****************************
  // determines which Monday will be the right-most value for the chart x axis
  // if today is Wednesday or sooner, then the right-msot value should be Monday of this week (the order data for next week will be pretty incomplete)
  // if today is Thursday or later, then the right-most value should be Monday of next week
  // tests: NOT DONE
  var getStartDate = function () {
    var weekday = moment().day();
    if(weekday < 4 && weekday !== 0) { //if it today is Wednesday or sooner in the week, start with Monday of this week
      var startDate = moment().day(1)
;    } else { // if today is Thursday or later in the week, start with Monday of next week
      var startDate = moment().day(8);
    }
    return startDate.hour(0).minute(0).seconds(0).milliseconds(0);
  }

  //*****************************
  //       getDataIndex()
  //*****************************
  // @param dueDate - the due date of the order
  // return the appropriate array index for which the pallet and hours quantity should be added to
  // index should be 0 for future order, and i if it was from i weeks back
  // tests: NOT DONE
  var getDataIndex = function (date) {
    var endDate = getStartDate().add(4, 'days');
    var daysAgo = endDate.diff(moment(date), 'days');
    return (Math.floor(daysAgo / 7));
  }


  // initialize chart parameters
  var data1 = [
    [0, 4],
    [-1, 8],
    [-2, 5],
    [-3, 10],
    [-4, 4],
    [-5, 16],
    [-6, 5],
    [-7, 11],
    [-8, 6]
  ];
  var data2 = [
    [0, 2],
    [-1, 5],
    [-2, 1],
    [-3, 3],
    [-4, 1],
    [-5, 0],
    [-6, 2],
    [-7, 0],
    [-8, 1]
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
      ticks: []
    },
    yaxis: {
        ticks: 4
    },
    tooltip: false
  };


}

})();
