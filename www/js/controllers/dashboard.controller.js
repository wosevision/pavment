angular.module('pavment.controllers')
.controller('DashCtrl', function($rootScope, $scope, $window, $ionicPlatform, $cordovaActionSheet, $ionDrawerVerticalDelegate, $ionicPopover, $ionicModal, Elevation, Chart) {
  
  $scope.Hill = {
    name: '',
    tags: [],
    panorama: {
      auto: true
    },
    coordinates: [[0,0],[0,0]],
    distance: 0,
    notes: ''
  };

  $scope.elevDisplay = false;
  $scope.hillData = [0, 0];
  $scope.chartObject = [{}];

  $scope.chartObject[0] = { 
    type: "LineChart",
    data: Chart.get('line'),
    displayed: false,
    options: {
      legend: "none",
      backgroundColor: "transparent",
      chartArea: {
        left: "15%",
        top: 20,
        width: "80%",
        height: "80%"
      },
      vAxis: {
        title: "Elevation (km)",
        titleTextStyle: {
            color: "#fff",
            italic: false
        },
        textStyle: {
            color: "#fff"
        },
        baselineColor : "#555",
        gridlines: {
            color: "#555"
        }
      },
      hAxis: {
        textPosition: "none",
        baselineColor : "#555",
        gridlines: {
            color: "#555"
        }
      },
      animation: {
        duration: 1000,
        easing: 'inAndOut',
        startup: false
      }
    },
    view: {
      columns: [0, 1, 2]
    }
  }
  $scope.chartObject[1] = { 
    type: "PieChart",
    data: Chart.get('pie'),
    options: {
      backgroundColor: "transparent",
      pieSliceBorderColor: "transparent",
      sliceVisibilityThreshold: 0,
      chartArea: {
        left: "5%",
        top: 20,
        width: "90%",
        height: "80%"
      },
      slices: {
        0: {color: '#0051f2'}, 
        1: {color: '#0aeadf'},
        2: {color: '#8b8b8b'},
        3: {color: '#29fc6f'},
        4: {color: '#ffc200'},
        5: {color: '#f00b47'}
      },
      legend: {
        textStyle: {
            color: "#fff"
        },
        position: "labeled"
        //alignment: "center"
      },
      pieHole: 0.9,
      animation: {
        duration: 1000,
        easing: 'inAndOut',
        startup: false
      }
    }
  }

  $scope.$on('drawChart', function(){
    setTimeout(function() {
      $scope.$apply();
    }, 0);
  });

  $ionicModal.fromTemplateUrl('modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.Map.setClickable(false);
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.Map.setClickable(true);
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.Map.setClickable(true);
    $scope.modal.remove();
  });

  /**
   * [popover description]
   * @type {[type]}
   */
  $scope.popover = $ionicPopover.fromTemplate(
    '<ion-popover-view><ion-header-bar> <h1 class="title">Hill actions</h1> </ion-header-bar> <ion-content><button class="button button-full button-outline button-royal">Save hill</button><button class="button button-full button-outline button-stable">Edit path</button></ion-content></ion-popover-view>',
    { scope: $scope }
  );
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

  /* Quick-n-dirty delegate function to handle
  opening and closing of bottom drawer */
  $scope.toggleDrawer = function() {
    $ionDrawerVerticalDelegate.toggleDrawer();
  };
  $scope.drawerIs = function(state) {
    return $ionDrawerVerticalDelegate.getState() == state;
  };

  // MAP VARIABLES
  $scope.markers = ['',''];
  $scope.path = [];
  $scope.polyline;

  $ionicPlatform.ready(function() {

    // Function that return a LatLng Object to Map
    function setPosition(lat, lng) {
        return new $window.plugin.google.maps.LatLng(lat, lng);
    }

    var mapDiv = document.getElementById("map_canvas");
    $scope.Map = $window.plugin.google.maps.Map.getMap(mapDiv,{
        'camera': {
            'latLng': setPosition(43.8832703,-78.9045525),
            'zoom': 19
        }
    });
    $scope.Map.setDebuggable(false);

    // $scope.Map = $window.plugin.google.maps.Map;
    var animation = $window.plugin.google.maps.Animation.DROP;
    var icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGRkZGRkY7fQ0KCS5zdDF7ZmlsbDojRUMxOTQ0O30NCjwvc3R5bGU+DQo8ZyBpZD0iWE1MSURfNDFfIj4NCgk8cGF0aCBpZD0iWE1MSURfMzhfIiBjbGFzcz0ic3QwIiBkPSJNMTYsMjguMWMtOC42LDAtOC42LTYuOS04LjYtNi45bDYuMy0xNy41bDQuNiwwbDYuMywxNy41QzI0LjYsMjEuMSwyNC42LDI4LjEsMTYsMjguMXoiLz4NCgk8cGF0aCBpZD0iWE1MSURfMzZfIiBjbGFzcz0ic3QxIiBkPSJNMTYsMjAuMWMzLjgsMCw2LjktMS4zLDcuMS0zYy0wLjYtMS42LTEuMi0zLjMtMS44LTVjLTAuNCwxLjItMi43LDIuMS01LjMsMi4xDQoJCXMtNC45LTAuOS01LjMtMi4xYy0wLjYsMS43LTEuMiwzLjQtMS44LDVDOS4xLDE4LjgsMTIuMiwyMC4xLDE2LDIwLjF6IE0xNiw5LjVjMS44LDAsMy40LTAuNSwzLjktMS40Yy0wLjctMS45LTEuMi0zLjUtMS42LTQuNQ0KCQljLTAuMi0wLjctMS4zLTEtMi4zLTFzLTIuMSwwLjMtMi4zLDFjLTAuNCwxLTAuOSwyLjYtMS42LDQuNUMxMi42LDguOSwxNC4yLDkuNSwxNiw5LjV6IE0yOS45LDIxLjZsLTUuOS0yLjRsMC43LDEuOQ0KCQljMCwyLTQsMy42LTguNiwzLjZjLTQuNywwLTguNi0xLjYtOC42LTMuNmwwLjctMS45bC01LjksMi40Yy0xLjcsMC43LTEuNywxLjktMC4yLDIuOGwxMS4yLDZjMS42LDAuOCw0LjIsMC44LDUuNywwbDExLjItNg0KCQlDMzEuNiwyMy41LDMxLjUsMjIuMywyOS45LDIxLjZ6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==';


    // Capturing event when Map load are ready.
    $scope.Map.addEventListener($window.plugin.google.maps.event.MAP_READY, function(){
      // INIT
      $scope.Map.addEventListener($window.plugin.google.maps.event.MAP_LONG_CLICK, function(latLng){

        if ($scope.markers[0] == '' && $scope.markers[1] == '') {
          $scope.path[0] = latLng;
          $scope.addPoint(latLng, 0);
          //displayLocationElevation(latLng, elevator, infowindow, document.getElementById('point_a_value') );

        } else if ($scope.markers[0] != '' && $scope.markers[1] == '') {
          $scope.path[1] = latLng;
          $scope.addPoint(latLng, 1);
          //displayLocationElevation(latLng, elevator, infowindow, document.getElementById('point_b_value') );
          $scope.displayPathElevation($scope.path);
        } else {
          $scope.path = [];
          $scope.Map.clear();
          $scope.markers[0] = '';
          $scope.markers[1] = '';
          $scope.path[0] = latLng;
          $scope.addPoint(latLng, 0);
        }
      });
    });

    $scope.addPoint = function(latLng, id) {

      function addCallback(results, status) {
        if (status === google.maps.ElevationStatus.OK) {
          if (results[0]) {
            $scope.hillData[id] = parseFloat( (results[0].elevation).toFixed(4) );
          } else {
           return 'No results found';
          }
        } else {
          return 'Elevation service failed: ' + status;
        }
      }
      $scope.Map.addMarker({
        'position': latLng,
        'icon': icon,
        'animation': animation
        //'draggable': true
      }, function(marker) {
        //console.log(Elevation.point(latLng));
        Elevation.point(latLng, addCallback);
        $scope.markers[id] = marker;
      });
    }
    $scope.displayPathElevation = function(path) {
      $scope.Map.addPolyline({
        points: path,
        'color' : 'rgba(240, 11, 71, 0.4)',
        'width': 3,
        'geodesic': true
      }, function(line) {
        $scope.polyline = line;
        $scope.polyline.on($window.plugin.google.maps.event.OVERLAY_CLICK, function(latLng, event) {
          $scope.polyline.setColor("rgba(240, 11, 71, 0.8)");
          $scope.polyline.setWidth(3);
          $scope.openPopover(mapDiv);
        });
      });
      $scope.Hill.distance = Elevation.distance(path);
      
      Elevation.path(path, function(data) {
        Chart.sync(data, $scope.Hill.distance);
      });
    }

    $scope.toggleElevation = function() {
      if ($scope.elevDisplay === false) {
        $scope.Map.setMapTypeId(plugin.google.maps.MapTypeId.TERRAIN);
        //alert('terrain!');
      } else {
        $scope.Map.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);
        //alert('roadmap!');
      }
      $scope.elevDisplay = !$scope.elevDisplay;
    };

    /* Geolocation dohickey */
    $scope.getMyLocation = function() {
      function onSuccess(location) {
        var msg = ["Current your location:\n",
          "latitude:" + location.latLng.lat,
          "longitude:" + location.latLng.lng,
          "speed:" + location.speed,
          "time:" + location.time,
          "bearing:" + location.bearing].join("\n");
        $scope.Map.animateCamera({
          target: {
            lat: location.latLng.lat,
            lng: location.latLng.lng
          },
          zoom: 15
        });
        $scope.Map.addMarker({
          'position': location.latLng,
          'title': msg
        }, function(marker) {
          marker.showInfoWindow();
        });
      };

      function onError(msg) {
        alert("error: " + msg);
      };
      $scope.Map.getMyLocation(onSuccess, onError);
    };

    $scope.showMapOptions = function() {
      //$rootScope.Map.setClickable(false);
      $cordovaActionSheet.show({
        title: 'Map options',
        buttonLabels: ['Show bike paths', 'Toggle terrain shading'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true,
        addDestructiveButtonWithLabel : 'Reset map'
      })
      .then(function(btnIndex) {
        var index = btnIndex;
        switch (index) {
          case 1:
            //reset map
            //alert(index);
            break;
          case 2:
            //show bike paths
            //alert(index);
            break;
          case 3:
            $scope.toggleElevation();
            //alert(index);
            break;
          default:
            //cancel
            //alert(index);
            break;
        }
        //$rootScope.Map.setClickable(true);
      });
    }
  });
});