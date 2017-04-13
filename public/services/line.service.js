(function () {
"use strict";

angular.module('scheduler')
.service('LineService', LineService);

LineService.$inject = ['$http', 'ApiPath', '$q'];
function LineService($http, ApiPath, $q) {
  var service = this;
  service.lines = [];

  service.getLinesByPlantId = function(plantid) {
    var fullPath = ApiPath + '/lines/' + plantid;
    return $http.get(fullPath).then( function (response) {
      response.data.lines.forEach( function (line) {
        storeLine(line);
      });
      return response.data;
    });
  };

  service.removeOrder = function (orderid) {

  }

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
    var fullPath = ApiPath + '/lines/' + lineid;
    return $http.patch(fullPath, changebody).then( function (data) {
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

var getLineById = function (id) {
  var result;
  service.lines.forEach( function (line) {
    if (line._id === id) {
      result = line;
    }
  });
  if (result) {
    return result;
  } else {
    return -1;
  }
}

var storeLine = function (line) {
  if (getLineById === -1) {
    service.lines.push(line);
  }
}


}// End Line Service

})();
