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
      console.log("submitting school");
      console.log($scope.schoolName);
      let passwordHash = md5.createHash($scope.schoolPassword || '');
      console.log(passwordHash);
      $http({
        method: 'POST',
        url: '/login/requestConnection',
        data: JSON.stringify({
          passwordHash: passwordHash
        })
      })
        .then(function (responseJson) {
          console.log("got random string response " + responseJson.data.randomString);
          console.log("Rehashing " + passwordHash + " to " + md5.createHash(passwordHash + responseJson.data.randomString));
          $http({
            method: 'POST',
            url: '/login/signupSchool',
            data: JSON.stringify({
              name: $scope.schoolName,
              passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
            })
          })
            .then(function (responseJson2) {
              console.log("Signup successful");
              $rootScope.session.setSchool(responseJson2.data.school, 0);
              $location.path('dashboard');
            })
            .catch(function (error) { console.error(error) })
        })
        .catch(function (error) { console.error(error) });

      return false;
    }

    $scope.submitAdmin = function () {
        console.log("submitting");
        console.log($scope.adminName);
        let passwordHash = md5.createHash($scope.adminPassword || '');
        console.log(passwordHash);
        $http({
          method: 'POST',
          url: '/login/requestConnection',
          data: JSON.stringify({
            passwordHash: passwordHash
          })
        })
          .then(function (responseJson) {
            console.log("got random string response " + responseJson.data.randomString);
            console.log("Rehashing " + passwordHash + " to " + md5.createHash(passwordHash + responseJson.data.randomString));
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
                console.log("login successful");
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
