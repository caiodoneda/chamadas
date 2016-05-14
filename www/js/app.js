// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
      $cordovaPlugin.Toast().then(success, error);
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
      }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  //window.localStorage['siteUrl'] = 'https://moodle.ufsc.br';
  window.localStorage['siteUrl'] = 'http://caiodoneda.servebeer.com/moodle29';

  $stateProvider

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  .state('my_sessions', {
      url: '/my-sessions/',
      templateUrl: 'templates/my-sessions.html',
      controller: 'MySessionsCtrl'
  })

  .state('session', {
      url: '/session/:moduleid/:sessionid/:groupid',
      templateUrl: 'templates/session.html',
      controller: 'MySessionCtrl'
  })

  .state('session_not_found', {
      url: '/session-not-found/',
      templateUrl: 'templates/session_not_found.html',
      controller: 'SessionNotFound'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
