/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */

function MainCtrl() {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
};


PublicController.$inject=['Session']
function PublicController(Session) {
  var $ctrl = this;
  this.test = "hello123";
  $ctrl.dashHeight = 190;
  $ctrl.bottomMargin = 10;

  $ctrl.user = Session.getUser();

  $ctrl.logout = function () {
    Session.logout();
  }

}


angular
    .module('scheduler')
    .controller('MainCtrl', MainCtrl)
    .controller('PublicController', PublicController);
