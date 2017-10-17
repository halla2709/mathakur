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
  .module('mathakur', ['ui.router', 'cloudinary'])
  .config(    
    function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/staff');
    $urlRouterProvider.otherwise('/login');

    
    $stateProvider
    .state('selectfood', {
      url: '/staff/selectfood',
      parent: 'dashboard',
      controller: 'SelectFoodCtrl',
      templateUrl: 'views/dashboard/selectfood.html',
      params: {param:null}

    })
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
      .state('adminpanel', {
        url: '/adminpanel',
        templateUrl: 'views/adminpanel.html',
        controller: 'AdminPanelCtrl'
      })
      .state('staffTable', {
        url: '/staffTable',
        templateUrl: 'views/admin/staffTable.html',
        parent: 'adminpanel'
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
      
  })
  .config(function(CloudinaryProvider) {
    CloudinaryProvider.configure({
      cloud_name: 'dk7mpsfkw',
      api_key: '431766444682953'
  });
});
