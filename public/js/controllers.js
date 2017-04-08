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



function PublicController() {
  var $ctrl = this;
  this.test = "hello123";
  $ctrl.dashHeight = 288;
  $ctrl.bottomMargin = 10;
}


angular
    .module('scheduler')
    .controller('MainCtrl', MainCtrl)
    .controller('PublicController', PublicController);
