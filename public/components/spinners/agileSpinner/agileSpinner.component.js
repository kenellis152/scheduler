(function () {
'use strict';

angular.module('scheduler')
.component('agileSpinner', {
  templateUrl: 'components/spinners/agileSpinner/agileSpinner.component.html',
  controller: agileSpinnerController
});

agileSpinnerController.$inject = ['$scope'];
function agileSpinnerController ($scope) {
  var $ctrl = this;
}

})();
