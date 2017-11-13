'use strict';

angular.module('myApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html',
    controller: 'mainController'
  });
}])
.controller('mainController', function($scope, $rootScope) {
  $scope.locationObj = {
    name: '',
    address: '',
    description: '',
    imageURL: '',
  };

  if($rootScope.globalData) {
    $rootScope.globalData.allowShowDescription = false;
    $rootScope.globalData.allowShowOverlay = false;
  }

  if($rootScope.globalFunction) {
    $rootScope.globalFunction['mapFunction'].showDescription = function(data) {
      var key = Object.keys(data)[0];
      $scope.locationObj = {
        name: key,
        address: data[key].address,
        description: data[key].description,
        imageURL: 'assets/img/' + data[key].imageURL,
      };
      
      $scope.globalData.allowShowOverlay = true;
      $scope.globalData.allowShowDescription = true;
    }
  }

  $scope.hideDescription = function () {
    $rootScope.globalFunction['mapFunction'].hideDescription();
  }  
});