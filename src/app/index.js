'use strict';

angular.module('finanse', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'restangular',
    'ui.router',
    'angularFileUpload'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
