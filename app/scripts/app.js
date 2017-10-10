'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
angular
  .module('mathakur', ['ui.router', 'cloudinary', 'angular-file-input'])
  .config(    
    function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/staff');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('imagetest', {
        url: '/imagetest',
        templateUrl: 'views/imagetest.html',
        controller: 'ImageCtrl'
      })
      .state('userlogin', {
        url: '/userlogin',
        templateUrl: 'views/userlogin.html'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .state('food', {
        url: '/food',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/food.html'
      })
      .state('staff', {
        url: '/staff',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/staff.html',
      })
      .state('selectfood', {
        url: '/selectfood',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/selectfood.html'
      })
  })
  .config(function(CloudinaryProvider) {
    CloudinaryProvider.configure({
      cloud_name: 'dk7mpsfkw',
      api_key: '431766444682953'
  });
});
