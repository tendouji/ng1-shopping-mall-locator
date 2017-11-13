'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'routeLinkComponent',
  'googleMapComponent',
  'descriptionPanelComponent',
  'myApp.main',
  'myApp.about',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/main'});
}])
.controller('GlobalController', ['$scope', function($scope) {
}]);