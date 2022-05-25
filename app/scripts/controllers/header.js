'use strict';

/**
 * @ngdoc functions
 * @name yapp.controller:MainCtrl
 * @description
 * # HeaderController
 * Controller of yapp
 */
angular.module('mathakur')
  .directive('mathakurheader', ['$rootScope', '$state', '$transitions', function ($rootScope, $state, $transitions) {
    return {
      templateUrl: '../../views/modules/header.html',
      restrict: 'E',
      link: function (scope) {
        scope.goToStaff = function () {
          $state.go('staff');
        }

        scope.goToFood = function () {
          $state.go('food');
        }

        scope.logOutSchool = function () {
          $rootScope.session.destroy();
          $state.go('login');
        }

        $rootScope.session.load().then(function() {
          $transitions.onSuccess({}, function() {
            if ($rootScope.session.isLoggedIn()) {
              scope.school = $rootScope.session.getSchoolName();
            }
            else {
              scope.school = false;
            }
          });
  
          if ($rootScope.session.isLoggedIn()) {
            scope.school = $rootScope.session.getSchoolName();
          }
          else {
            scope.school = false;
          }
        });
      }
    }

  }]);
