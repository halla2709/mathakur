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
    $urlRouterProvider.when('/adminpanel', '/adminpanel/intro');
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('frontpage', {
      url: '/',
      templateUrl: 'views/frontpage.html',
      controller: 'FrontPageCtrl'
    })
    .state('selectproduct', {
      url: '/staff/selectproduct',
      parent: 'dashboard',
      templateUrl: 'views/dashboard/selectproduct.html'
    })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
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
      .state('productTable', {
        url: '/productTable',
        templateUrl: 'views/admin/productTable.html',
        parent: 'adminpanel'
      })
      .state('intro', {
        url: '/intro',
        templateUrl: 'views/admin/intro.html',
        parent: 'adminpanel'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/admin/settings.html',
        parent: 'adminpanel'
      })
      .state('adminsTable', {
        url: '/adminsTable',
        templateUrl: 'views/admin/adminTable.html',
        parent: 'adminpanel'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .state('product', {
        url: '/product',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/product.html',
      })
      .state('staff', {
        url: '/staff',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/staff.html',
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/modules/about.html',
      })
      .state('help', {
        url: '/help',
        templateUrl: 'views/modules/help.html',
      })
  })
  .config(function (CloudinaryProvider) {
    CloudinaryProvider.configure({
      cloud_name: 'dk7mpsfkw' // 'dk7mpsfkw'
    })
  })
  .run(['$rootScope', 'session', assignServicesToRootScope]);

function assignServicesToRootScope($rootScope, session) {
  $rootScope.session = session;
}