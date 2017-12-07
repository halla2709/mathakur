'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$state', '$http', '$location', function ($scope, $rootScope, $state, $http, $location) {

    if($rootScope.session.getLevel() < 0) {
      console.log("no one is logged in");
      $location.path('/login');
    }
      
    $scope.$state = $state;
    $scope.selectStaff = function(employee) {
      $state.go("selectfood", {param:employee});
    }

    $http.get("employee").then(function (response) {
        $scope.myDataEmployee = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

      $http.get("food").then(function (response) {
        $scope.myDataFood = response.data;
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

      $scope.logOut = function() {
        $rootScope.session.destroy();
        $location.path('/login');
      }

  }]);