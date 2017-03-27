(function () {
"use strict";

angular.module('scheduler')
.service('LineService', LineService);

LineService.$inject = ['$http', 'ApiPath', '$q'];
function LineService($http, ApiPath, $q) {
  var service = this;

  service.getLinesByPlantId = function(plantid) {
    return $http.get(ApiPath + `/lines/${plantid}`).then( function (response) {
      return response.data;
    });
  };

  service.addLinesToPlant = function(plant) {
    var result = $q.defer();
    service.getLinesByPlantId(plant.id).then( function (data) {
      for (var i = 0; i < data.lines.length; i++) {
        var linename = "Line " + JSON.stringify(i + 1);
        plant.lines[i] = findLineByName(data.lines, linename);
      }
      result.resolve(plant);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };//End addLinesToPlant

  service.updateLine = function(lineid, changebody) {
    return $http.patch(ApiPath + `/lines/${lineid}`, changebody).then( function (data) {
      return data.line;
    }).catch( function (err) {
      console.log('failed to update line:', err);
    });
  }

  //*****************************
  //       Helper functions
  //*****************************
var findLineByName = function (lines, name) {
  var result;
  lines.forEach( function (line) {
    if (line.name === name) { result = line;}
  });
  if (result) {
    return result;
  } else {
    return -1;
  }
}


}// End Line Service

})();
