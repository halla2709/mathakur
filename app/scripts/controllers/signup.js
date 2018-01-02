'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('SignupCtrl', ['$scope', '$rootScope', '$state', '$location', '$http', 'md5', function ($scope, $rootScope, $state, $location, $http, md5) {

    $scope.schoolName = '';
    $scope.adminName = '';
    $scope.userName = '';
    $scope.adminPassword = '';
    $scope.schoolPassword = '';

    $scope.submitSchool = function () {
      let passwordHash = md5.createHash($scope.schoolPassword || '');
      $http({
        method: 'POST',
        url: '/login/requestConnection',
        data: JSON.stringify({
          passwordHash: passwordHash
        })
      })
        .then(function (responseJson) {
          $http({
            method: 'POST',
            url: '/login/signupSchool',
            data: JSON.stringify({
              name: $scope.schoolName,
              passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
            })
          })
            .then(function (responseJson2) {
              $rootScope.session.setSchool(responseJson2.data.school, 0);
              $location.path('dashboard');
            })
            .catch(function (error) { console.error(error) })
        })
        .catch(function (error) { console.error(error) });

      return false;
    }

    $scope.submitAdmin = function () {
        let passwordHash = md5.createHash($scope.adminPassword || '');
        $http({
          method: 'POST',
          url: '/login/requestConnection',
          data: JSON.stringify({
            passwordHash: passwordHash
          })
        })
          .then(function (responseJson) {
            $http({
              method: 'POST',
              url: '/login/signupAdmin',
              data: JSON.stringify({
                schoolName: $scope.schoolName,
                name: $scope.adminName,
                username: $scope.userName,
                passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
              })
            })
              .then(function (responseJson2) {
                $rootScope.session.setSchool(responseJson2.data.schoolName, 0);
                $rootScope.session.setUser(responseJson2.data.name, 1);
                $location.path('adminpanel');
              })
              .catch(function (error) { console.error(error) })
          })
          .catch(function (error) { console.error(error) });
          
        return false;
      }
  }]);
