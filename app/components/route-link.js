angular.module('routeLinkComponent', []).
controller('routeController', function ($scope, $rootScope) {
  $rootScope.globalData = { 
    setGPS: false,
    isLocatorDisabled: false
  };
  
  $scope.getCurrentLocation = function(evt) {
    if ($scope.globalData.isLocatorDisabled) {
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition($scope.goToPosition);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  
  $scope.goToPosition = function(position) {
    //$scope.globalData.setGPS = true;
    $scope.$apply(function() {
      $scope.globalData.setGPS = true;
    });

    var pinUrl = 'assets/img/red-pin.png';
    $scope.globalFunction.mapFunction.setMarker(position.coords.latitude, position.coords.longitude, 'My Location', 'We found you here!', pinUrl);

    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    $scope.globalData.mapData.map.panTo(center);
  }
}).
directive('activeLink', ['$location', function (location) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs, controller) {
      var className = attrs.activeLink;
      var path = attrs.href;
      path = path.substring(1);
      $scope.location = location;
      $scope.$watch('location.path()', function (newPath) {
        $scope.globalData.isLocatorDisabled = (newPath !== '/main');
        if(path === newPath) {
          element.addClass(className);
        } else {
          element.removeClass(className);
        }
      });
    }
  };
}]);