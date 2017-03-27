(function () {
'use strict';

angular.module('scheduler')
.component('saveChanges', {
  templateUrl: 'components/modals/saveChanges/saveChanges.component.html',
  bindings: {
    add: '&',
    plant: '<'
  },
  controller: saveChangesController
});

saveChangesController.$inject = ['PlantService']
function saveChangesController (PlantService) {
  var $ctrl = this;

  $ctrl.submit = function() {
    PlantService.saveChanges($ctrl.plant);

    $('#saveChangesModal').modal('toggle');
  } // End Submit

}

})();
