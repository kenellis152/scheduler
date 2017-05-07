(function () {
'use strict';

angular.module('scheduler')
.component('changePlant', {
  templateUrl: 'components/modals/changePlant/changePlant.component.html',
  bindings: {
    plant: '<'
  },
  controller: changePlantController
});

changePlantController.$inject = ['OrdersService', 'PlantService', '$scope', '$rootScope']
function changePlantController (OrdersService, PlantService, $scope, $rootScope) {
  var $ctrl = this;

  var changePlantModal = $('#changePlantModal').on('shown.bs.modal', function() {
    $('[autofocus]').focus();
    $ctrl.params = _.pick($ctrl.plant, ['activeShifts', 'shiftHours', 'numLines']);

  });

  $ctrl.submit = function() {
    var data = {id: $ctrl.plant.id, activeShifts: $ctrl.params.activeShifts, shiftHours: $ctrl.params.shiftHours, numLine: $ctrl.params.numLines}
    PlantService.updatePlant($ctrl.plant.id, $ctrl.params.activeShifts, $ctrl.params.shiftHours, $ctrl.params.numLines)
    .then( function(result) {
      $ctrl.plant = result;
      $scope.$emit('stockBoard:update');
      $rootScope.$broadcast('resinDash:update', data);
    }).catch( function (err) {
      console.log('failed to update plant', err);
    });
    $('#changePlantModal').modal('toggle');
  } // End Submit



}

})();
