// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('pavment', ['ionic','ionic.service.core', 'ngCordova', 'ionic.contrib.drawer.vertical', 'jett.ionic.filter.bar', 'googlechart', 'ngTagsInput', 'pavment.directives', 'pavment.controllers', 'pavment.services']) //'ionic-pullup',

.run(function($ionicPlatform, $rootScope, $cordovaStatusbar, Elevation, Chart) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

      $cordovaStatusbar.style(1);
    }
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.discover', {
    url: '/discover',
    views: {
      'tab-discover': {
        templateUrl: 'templates/tab-discover.html',
        controller: 'DiscoverCtrl'
      }
    }
  })

  .state('tab.saved', {
    url: '/saved',
    views: {
      'tab-saved': {
        templateUrl: 'templates/tab-saved.html',
        controller: 'SavedCtrl'
      }
    }
  })
    .state('tab.saved-detail', {
      url: '/saved/:hillID',
      views: {
        'tab-saved': {
          templateUrl: 'templates/saved-detail.html',
          controller: 'SavedDetailCtrl'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
