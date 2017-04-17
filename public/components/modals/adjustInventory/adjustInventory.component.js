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

adjustInventoryController.$inject = ['PlantService', 'SpecService', '$q', '$scope']
function adjustInventoryController (PlantService, SpecService, $q, $scope) {
  var $ctrl = this;

  var adjustInventoryModal = $('#adjustInventoryModal').on('shown.bs.modal', function() {
    updateParams();
    $('[autofocus]').focus();
  });

  $ctrl.$onchanges = function () {
    updateParams();
  }

  $ctrl.submit = function() {
    var promises = [];
    if ($ctrl.params.adjustment) {
      // convert pallet quantity to piece quantity
      $ctrl.params.adjustment *= $ctrl.selection.spec.palletCount;
      console.log($ctrl.params.part, $ctrl.params.adjustment, $ctrl.plant.id, $ctrl.params.date);
      promises.push(PlantService.adjustInventory($ctrl.params.part, $ctrl.params.adjustment, $ctrl.plant.id, $ctrl.params.date));
    }
    if ($ctrl.params.part !== $ctrl.selection.part || $ctrl.params.customer !== $ctrl.selection.customer || $ctrl.params.quantity * $ctrl.selection.spec.palletCount !== $ctrl.selection.quantity) {
      // convert pallet quantity to piece quantity
      $ctrl.params.quantity *= $ctrl.selection.spec.palletCount;
      console.log('updating stock item');
    }

    $q.all(promises).then( function (results) {
      console.log('success')
      $scope.$emit('stockBoard:update');
      $('#adjustInventoryModal').modal('toggle');
    }).catch( function (error) {
      console.log('failure', error);
      $('#adjustInventoryModal').modal('toggle');
    });
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
    $ctrl.params.date = new Date();
  }

}


})();
