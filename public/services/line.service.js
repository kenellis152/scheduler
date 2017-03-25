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
        plant.lines[i] = data.lines[i];
      }
      result.resolve(plant);
    }, function(err) {
      result.reject(err);
    });
    return result.promise;
  };

}

})();
