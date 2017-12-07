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
  .module('mathakur', ['ui.router', 'cloudinary', 'angular-md5'])
  .config(
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/staff');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('selectfood', {
        url: '/staff/selectfood',
        parent: 'dashboard',
        controller: 'SelectFoodCtrl',
        templateUrl: 'views/dashboard/selectfood.html',
        params: { param: null }
      })
      .state('orderconfirm', {
        url: '/selectfood/orderconfirm',
        parent: 'dashboard',
        controller: 'orderConfirmCtrl',
        templateUrl: 'views/dashboard/orderconfirm.html',
        params: { param: null }
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
        templateUrl: 'views/userlogin.html',
        controller: 'UserLoginCtrl'
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
      .state('foodTable', {
        url: '/foodTable',
        templateUrl: 'views/admin/foodTable.html',
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
        templateUrl: 'views/dashboard/food.html',
        controller: 'FoodCtrl'
      })
      .state('staff', {
        url: '/staff',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/staff.html',
      })

  })
  .config(function (CloudinaryProvider) {
    CloudinaryProvider.configure({
      cloud_name: 'dk7mpsfkw',
      api_key: '431766444682953'
    })
  })
  .run(['$rootScope', 'session', '$location', assignServicesToRootScope]);

function assignServicesToRootScope($rootScope, session, $location) {
  $rootScope.session = session;
}