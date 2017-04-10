(function () {
'use strict';

angular.module('scheduler')
.component('login', {
  templateUrl: 'components/modals/login/login.component.html',
  bindings: {
    add: '&',
    plant: '<'
  },
  controller: loginController
});

loginController.$inject = ['Session', '$http', 'ApiPath']
function loginController (SessionService, $http, ApiPath) {
  var $ctrl = this;
  $ctrl.email = "";
  $ctrl.password = "";

  $('#loginModal').on('shown.bs.modal', function() {
    $('[autofocus]').focus();
  });

  $ctrl.submit = function() {
    var user = {email: $ctrl.email, password: $ctrl.password};
    SessionService.login(user).then( function (response) {
      $('#loginModal').modal('toggle');
    }).catch ( function (e) {

    });

  } // End Submit
}

})();
