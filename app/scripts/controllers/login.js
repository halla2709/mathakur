'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('LoginCtrl', function($scope, $location) {

    $scope.submit = function() {
      console.log("submitting");

      $location.path('dashboard');

      return false;
    }

  });
