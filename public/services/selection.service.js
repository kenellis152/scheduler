(function () {
"use strict";

angular.module('scheduler')
.service('SelectionService', SelectionService);

//*****************************
//       Selection Service
//*****************************
// Keeps track of which order card is selected
// tracks by order id
SelectionService.$inject = ['$rootScope', 'SpecService'];
function SelectionService($rootScope, SpecService) {
  var service = this;
  service.selection = 0;
  $('#orderdetails').slideUp();

  //*****************************
  //       clickProcess()
  //*****************************
  // called from order card component when it is clicked
  // update the selection, and broadcast the order details of the selected card
  service.clickProcess = function (id, order, spec) {
    if (service.selection === 0) {
      select(id);
      broadcastOrder(order, spec);
      $('#orderdetails').slideDown();
      return service.selection = id;
    }
    if (service.selection === id) {
      deselect(id);
      $('#orderdetails').slideUp();
      return service.selection = 0;
    }
    deselect(service.selection);
    service.selection = id;
    select(id);
    broadcastOrder(order, spec);
  } // End clickProcess()

  // returns the order id of whichever card is selected
  service.getSelected = function () {
    return service.selection;
  }

  var select = function (id) {
    var target = "#" + id;
    $(target).addClass("selected");
  } // End select()

  var deselect = function (id) {
    var target = "#" + id;
    $(target).removeClass("selected");
  } // End deselect()

  var broadcastOrder = function (order, spec) {
    $rootScope.$broadcast( 'namespace:changeOrderDetail', {order, spec});
  }


} // end SelectionService

})();
