(function () {
'use strict';

angular.module('scheduler')
.component('confirmDelete', {
  templateUrl: 'components/modals/confirmDelete/confirmDelete.component.html',
  bindings: {
    add: '&',
    plant: '<'
  },
  controller: confirmDeleteController
});

confirmDeleteController.$inject = ['OrdersService', 'SelectionService', 'PlantService']
function confirmDeleteController (OrdersService, SelectionService, PlantService) {
  var $ctrl = this;

  $ctrl.submit = function() {
    var id = SelectionService.getSelected();
    PlantService.removeOrder(id);
    OrdersService.deleteOrder(id);
    $('#confirmDeleteModal').modal('toggle');
  } // End Submit

}

})();
