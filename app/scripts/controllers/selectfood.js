'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('SelectFoodCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {

    $scope.$state = $state;
    $scope.employee = $stateParams.param;

    $http.get("employee").then(function (response) {
        $scope.myDataEmployee = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

      $http.get("food").then(function (response) {
        $scope.myDataEmployee = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

      $http.get("school").then(function (response) {
        $scope.myDataSchool = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

  }]);