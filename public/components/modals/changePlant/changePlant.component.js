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

changePlantController.$inject = ['OrdersService', 'PlantService', '$scope']
function changePlantController (OrdersService, PlantService, $scope) {
  var $ctrl = this;

  var changePlantModal = $('#changePlantModal').on('shown.bs.modal', function() {
    $('[autofocus]').focus();
    $ctrl.params = _.pick($ctrl.plant, ['activeShifts', 'shiftHours', 'numLines']);

  });

  $ctrl.submit = function() {

    PlantService.updatePlant($ctrl.plant.id, $ctrl.params.activeShifts, $ctrl.params.shiftHours, $ctrl.params.numLines)
    .then( function(result) {
      $ctrl.plant = result;
      $scope.$emit('stockBoard:update');
    }).catch( function (err) {
      console.log('failed to update plant', err);
    });
    $('#changePlantModal').modal('toggle');
  } // End Submit



}

})();
