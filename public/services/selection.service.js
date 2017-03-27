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
      showOrderDetails();
      return service.selection = id;
    }
    if (service.selection === id) {
      deselect(id);
      showDash();
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
    $("#" + id).addClass("selected");
  } // End select()

  var deselect = function (id) {
    $("#" + id).removeClass("selected");
  } // End deselect()

  // broadcasts
  var broadcastOrder = function (order, spec) {
    $rootScope.$broadcast( 'namespace:changeOrderDetail', {order, spec});
  }

  var showOrderDetails = function () {
    $('#resindash').css('display', 'none');
    $('#orderdetail').css('display', 'block');
  }

  var showDash = function () {
    $('#orderdetail').css('display', 'none');
    $('#resindash').css('display', 'block');
  }


} // end SelectionService

})();
