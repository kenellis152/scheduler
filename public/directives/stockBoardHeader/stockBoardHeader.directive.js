(function () {
'use strict';

angular.module('scheduler')
.directive('stockBoardHeader', stockBoardHeader);

function stockBoardHeader() {
  var ddo = {
    templateUrl: 'directives/stockBoardHeader/stockBoardHeader.directive.html',
  }

  return ddo;
}

})();
