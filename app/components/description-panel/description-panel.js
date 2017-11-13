angular.module('descriptionPanelComponent', []).
component('descriptionPanel', {
  templateUrl: '/components/description-panel/description-panel.html',
  bindings: {
    locationObj: '='
  }
}).
controller('descriptionController', function ($scope, $rootScope) {
  if($rootScope.globalFunction) {
    $rootScope.globalFunction['mapFunction'].hideDescription = function() {
      $rootScope.globalData.allowShowOverlay = false;
      $rootScope.globalData.allowShowDescription = false;
    }
  }

  $scope.hideDescription = function() {
    $rootScope.globalFunction['mapFunction'].hideDescription();
  }  
});