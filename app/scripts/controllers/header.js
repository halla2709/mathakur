'use strict';

/**
 * @ngdoc functions
 * @name yapp.controller:MainCtrl
 * @description
 * # HeaderController
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$location', '$window', function ($scope, $rootScope, $state,  $location) {

    if ($rootScope.session.getLevel() >= 0) 
    {
      console.log(vont);
      $location.path('/login');
      $scope.isSchoolLoggedIn = true;
    }
    
    else
    {
      $scope.isSchoolLoggedIn = false;
      console.log(gott);
    }


    $scope.goToStaff = function () {
      $state.go('staffTable');
      $scope.editing = false;
      $scope.updating = false;
    }

    $scope.goToFood = function () {
      $state.go('foodTable');
      $scope.editing = false;
      $scope.updating = false;
    }

    $scope.logOutSchool = function () {
      $rootScope.session.destroy();
      $location.path('/login');
    }

  }]);
