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

        scope.goToProduct = function () {
          $state.go('product');
        }

        scope.logOutCompany = function () {
          $rootScope.session.logOutCompany();
          $state.go('login');
          return;
        }

        $rootScope.session.load().then(function() {
          $transitions.onSuccess({}, function() {
            if ($state.includes('adminpanel')) 
            {
              scope.company = false;
            }
            else if ($rootScope.session.isLoggedIn()) {
              scope.company = $rootScope.session.getCompanyName();
            }
            else {
              scope.company = false;
            }
          });

          if ($state.includes('adminpanel')) 
          {
            scope.company = false;
          }
          else if ($rootScope.session.isLoggedIn()) {
            scope.company = $rootScope.session.getCompanyName();
          }
          else {
            scope.company = false;
          }
        });
      }
    }

  }]);
