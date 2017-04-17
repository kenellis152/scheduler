(function () {
'use strict';

angular.module('scheduler')
.component('adjustInventory', {
  templateUrl: 'components/modals/adjustInventory/adjustInventory.component.html',
  bindings: {
    selection: '<',
    plant: '<'
  },
  controller: adjustInventoryController
});

adjustInventoryController.$inject = ['PlantService', 'SpecService']
function adjustInventoryController (PlantService, SpecService) {
  var $ctrl = this;

  var adjustInventoryModal = $('#adjustInventoryModal').on('shown.bs.modal', function() {
    updateParams();
    $('[autofocus]').focus();
  });

  $ctrl.$onchanges = function () {
    updateParams();
  }

  $ctrl.submit = function() {
    if ($ctrl.params.adjustment) {
      console.log('adjusting current inventory');
    }
    if ($ctrl.params.part !== $ctrl.selection.part || $ctrl.params.customer !== $ctrl.selection.customer || $ctrl.params.quantity * $ctrl.selection.spec.palletCount !== $ctrl.selection.quantity) {
      $ctrl.params.quantity *= $ctrl.selection.spec.palletCount;
      console.log('updating stock item');
    }
    $('#adjustInventory').modal('toggle');
  } // End Submit

  $ctrl.validate = function () {
    console.log('validating');
    if ( $ctrl.params.part === $ctrl.selection.part ) {
      return $ctrl.invalid = false;
      $ctrl.error = "";
    } else {
      $ctrl.invalid = true;
    }
    SpecService.getSpecByPart($ctrl.params.part).then( function (response) {
      console.log(response);
      if (response.spec) {
        $ctrl.invalid = false;
        $ctrl.error = "";
      } else {
        $ctrl.error = "PART NOT FOUND";
        $ctrl.invalid = true;
      }
    }).catch( function (e) {
      $ctrl.error = "PART NOT FOUND";
      $ctrl.invalid = true;
    });
  }

  var updateParams = function () {
    $ctrl.params = _.pick($ctrl.selection, ['part', 'customer', 'quantity']);
    $ctrl.params.quantity /= $ctrl.selection.spec.palletCount;
  }

}


})();
