(function () {
'use strict';

angular.module('scheduler')
.directive('mainDashResinHeader', mainDashResinHeader);

function mainDashResinHeader() {
  var ddo = {
    templateUrl: 'directives/mainDashResinHeader/mainDashResinHeader.directive.html',
  }

  return ddo;
}

})();
