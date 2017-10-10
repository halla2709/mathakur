'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('DashboardCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {

    $scope.$state = $state;
        
  
    $http.get("employee").then(function(response) {
      $scope.myData = response.data;
       })
       .catch(function(response) {
        //Error handle
        $scope.content = "Something went wrong";
       });
      
    

    }]);
