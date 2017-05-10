(function () {
'use strict';

angular.module('scheduler')
.component('specTool', {
  templateUrl: 'components/specTool/specTool.component.html',
  controller: specToolController
});

specToolController.$inject = ['Session', '$scope', 'SpecService', '$q'];
function specToolController (Session, $scope, SpecService, $q) {
  var $ctrl = this;
  $ctrl.loginStatus = Session.getLoginStatus();
  $ctrl.valid = false; //stores whether or not valid data was parsed and whether or not user is cleared to submit

  $ctrl.parse = function () {
    $ctrl.entries = []; // stores the new entries
    var promises = [];
    $ctrl.rows = []; // stores each row to output after parsing
    var rows = $ctrl.inputData.split("\n");
    rows.forEach( function (row) {
      var entry = {}; // the resin spec object to be added
      var cells = row.split("\t");
      entry.part = cells[1];
      entry.description = cells[2];
      entry.clip = cells[3];
      entry.boxSw = cells[4];
      entry.piecesPerBundle = cells[5];
      entry.bundleWeight = cells[6];
      entry.numBoxes = cells[7];
      entry.palletCount = cells[8];
      entry.packagingCode = cells[9];
      entry.speed = cells[10];
      entry.gelSpeed = cells[11];
      entry.viscosity = cells[12];
      entry.formulation = cells[13];
      entry.masticPartNumber = cells[14];
      entry.catalystPartNumber = cells[15];
      entry.cartridgeLength = cells[16];
      entry.holeDiameter = cells[17];
      entry.mmCartridgeDiameter = cells[18];
      entry.inCartridgeDiameter = cells[19];
      entry.groutVolume = cells[20];
      entry.labelColor = cells[21];
      entry.secondDescription = cells[23];
      entry.expiration = cells[24];
      entry.cartSpeed = cells[25];
      entry.cartDiam = cells[26];
      entry.holeDiam = cells[27];
      entry.cartLength = cells[43];
      entry.standardLinearDensity = cells[55];
      entry.standardWeightLbs = cells[56];
      entry.standardWeightGrams = cells[57];
      entry.masticPN = cells[61];
      entry.masticWeightLbs = cells[62];
      entry.pastePN = cells[63];
      entry.pastWeightLbs = cells[64];
      entry.clips = cells[66];
      entry.clipPN = cells[67];
      entry.innerFilm = cells[68];
      entry.innerFilmLength = cells[69];
      entry.innerFilmPN = cells[70];
      entry.outerFilm = cells[71];
      entry.outerFilmLength = cells[72];
      entry.outerfilmPN = cells[73];
      entry.boxDescription = cells[79];
      entry.boxTopPN = cells[80];
      entry.boxBottomPN = cells[81];
      entry.boxWeight = cells[82];
      entry.boxStraps = cells[83];
      entry.shrinkWrapPN = cells[84];
      entry.shrinkWrapWeightGrams = cells[85];
      entry.shrinkWrapWeightLbs = cells[86];
      entry.volume = cells[87];
      entry.filmLength = cells[91];
      entry.filmLengthWithAngle = cells[92];
      entry.extraClipPN = cells[93];
      entry.xaShippingWeight = cells[94];
      entry.palletSize = cells[95];
      entry.palletWeight = cells[96];
      promises.push(SpecService.checkPNExists(entry.part));
      $ctrl.entries.push(entry);
    });
    $q.all(promises).then( function (result) {
      console.log(result)
      for (let i = 0; i < result.length; i++) {
        if (result[i] === 0) {
          $ctrl.entries[i].newPN = 'Create New Part #';
        } else {
          $ctrl.entries[i].newPN = 'Update Existing Part #';
        }
      }
      $ctrl.entries.forEach( function (entry) {
        $ctrl.rows.push(entry);
      });
      $ctrl.valid = true;
    });
  }

  $ctrl.submit = function () {
    var promises = [];
    $ctrl.entries.forEach( function (entry) {
      if(entry.newPN === 'Create New Part #' ) {
        promises.push(SpecService.addSpec(entry));
      } else {
        promises.push(SpecService.updateSpec(entry));
      }
    });
    $q.all(promises).then( function (results) {
      results.forEach( function (result) {
        console.log(result);
      });
      $ctrl.result = 'Great Success';
      $ctrl.inputData = '';
    }).catch( function (error) {
      console.log('error: ', error);
      $ctrl.inputData = '';
      $ctrl.result = 'Epic Failure';
    })
  }


  var loginStatus = $scope.$on('namespace:loginStatus', function (event, data) {
    $ctrl.loginStatus = data.status;
    console.log('login', data);
  });

  $ctrl.$onDestroy = function () {
    loginStatus();
  }

}//end specToolController
})();
