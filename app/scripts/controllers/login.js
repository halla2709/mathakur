'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('LoginCtrl', ['$scope', '$state','$location','$http', function($scope, $state, $location, $http) {

    $scope.submit = function() {
      console.log("submitting");

      $location.path('dashboard');

      return false;
    }

    $http.get("school").then(function(response) {
      $scope.myData = response.data;
       })
       .catch(function(response) {
        //Error handle
        $scope.content = "Something went wrong";
       });

  }]);
