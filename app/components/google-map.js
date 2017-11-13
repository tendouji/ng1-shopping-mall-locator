angular.module('googleMapComponent', ['ngSanitize']).
controller('mapController', function ($scope, $rootScope, $http, $compile) {
  $rootScope.globalData = {
    mapData : {
      map: null,
      markers: [], 
      locationsDataURL: 'assets/data/malls-kl.json',
      locationsData: {},
      infoWindow: null,
      infoWindowStr: ['<div class="pin-panel">',
                      '<h3>', 0, '</h3>',
                      '<div class="location-content">', 1, '</div>',
                      '<div class="action-area">', 
                      '<a ng-click="showDescription(', 2, ', \'', 3, '\')">More <i class="material-icons">keyboard_arrow_right</i></a>',
                      '</div>', 
                      '</div>'],
    }
  };
  $rootScope.globalFunction = {
    mapFunction: {
      setMarker: function(lat, lng, title, content, pinImg) {
        var $mapData = $rootScope.globalData.mapData, 
          $mapFunction = this;
        var marker, 
          latLng = new google.maps.LatLng(lat, lng);
        var markerOptions = {
          position: latLng,
          map: $mapData.map,
          title: (title.split('|'))[0],
          icon: pinImg
        };
        var clusterUrl = 'assets/img/m',
          mcOptions = { imagePath: clusterUrl },
          markerCluster = new MarkerClusterer($mapData.map, [], mcOptions);
            
        marker = new google.maps.Marker(markerOptions);
        $mapData.markers.push(marker); // add marker to array
        
        google.maps.event.addListener(marker, 'click', function() {
          // close window if not undefined
          if ($mapData.infoWindow) {
            $mapData.infoWindow.close();
          }
          // create new window
          var infoWindowOptions = {
            content: $mapFunction.createInfoWindowContent(title, content)
          };
          $mapData.infoWindow = new google.maps.InfoWindow(infoWindowOptions);
          $mapData.infoWindow.open($mapData.map, marker);
        });
          
        google.maps.event.addListenerOnce($mapData.map, 'idle', function() {
          // Add a marker clusterer to manage the markers.
          markerCluster = new MarkerClusterer($mapData.map, $mapData.markers, mcOptions);
        });
      },
      createInfoWindowContent: function(title, description) {
        var $mapData = $rootScope.globalData.mapData, 
          infoWindowStr = $mapData.infoWindowStr,
          titleArr = title.split('|'),
          compiledCode;
        
        infoWindowStr[2] = titleArr[0];
        infoWindowStr[5] = description;
        if (title == 'My Location') {
          var tempArr = infoWindowStr.slice(0);
          tempArr.splice(7, 7);
          compiledCode = $compile(tempArr.join(''))($scope);
        } else {
          infoWindowStr[9] = titleArr[1];
          infoWindowStr[11] = titleArr[2];
          compiledCode = $compile(infoWindowStr.join(''))($scope);
        }
        
        return compiledCode[0];
      },
      loadLocation: function(callback) {
        if(typeof callback == 'function') {
          $http.get($scope.globalData.mapData.locationsDataURL)
            .then(function(resp) {
              $scope.globalData.mapData.locationsDataURL = resp.data;
              callback(resp.data);
            });
        }
      }
    }
  };

  $scope.showDescription = function(n, zone) {
    var locations = $scope.globalData.mapData.locationsDataURL;
    $rootScope.globalFunction.mapFunction.showDescription(locations[zone][n]);
  }
}).
directive('googleMap', function () {
  // directive link function
  var link = function ($scope, element, attrs) {
    var map, infoWindow;
    var pinUrl = 'assets/img/green-pin.png';

    // map config @ kuala lumpur
    var mapOptions = {
      //center: new google.maps.LatLng(3.1468059, 101.6897892),
      center: { lat: 3.1468059, lng: 101.6897892 },
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
    };

    // init the map
    function initMap() {
      $scope.globalFunction.mapFunction.loadLocation(function(data) {
        if (map === void 0) {
          map = new google.maps.Map(element[0], mapOptions);
          $scope.globalData.mapData.map = map;
          
          // show the map and place some markers
          var locations = data;
          for (var zone in locations) {
            if (locations.hasOwnProperty(zone)) {
              var location = locations[zone];
              for (var i in location) {
                var obj = location[i],
                  key = Object.keys(obj)[0],
                  title = Object.keys(obj)[0] + '|' + i + '|' + zone,
                  content = obj[key].address,
                  lat = obj[key].coordinate.lat,
                  lng = obj[key].coordinate.lng;
                
                $scope.globalFunction.mapFunction.setMarker(lat, lng, title, content, pinUrl);
              }
            }
          }
        }
      });
    }

    initMap();
  };

  return {
    restrict: 'A',
    template: '<div id="googleMaps"></div>',
    replace: true,
    link: link
  };
});
