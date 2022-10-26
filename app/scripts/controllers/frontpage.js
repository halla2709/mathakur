'use strict';

/**
 * @ngdoc functions
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('FrontPageCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.goToLogin = function() {
      $state.go('login');
    }

    $scope.goToAbout = function() {
      $state.go('about');
    }

    $scope.goToHelp = function() {
      $state.go('help');
    }
  }
]);