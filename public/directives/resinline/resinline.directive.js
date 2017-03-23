(function () {
'use strict';

angular.module('scheduler')
.directive('resinLine', resinLine);

function resinLine() {
  var ddo = {
    templateUrl: 'directives/resinline/resinline.directive.html',
  }

  return ddo;
}

})();
