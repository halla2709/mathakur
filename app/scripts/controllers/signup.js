'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('SignupCtrl', ['$scope', '$state', '$location', '$http', 'md5', function ($scope, $state, $location, $http, md5) {

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
          name: $scope.schoolName,
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
            .then(function () {
              console.log("Signup successful");
              $location.path('dashboard');
            })
            .catch(function (error) { console.error(error) })
        })
        .catch(function (error) { console.error(error) });

      return false;
    }

    $scope.submitAdmin = function () {
        console.log("submitting");
        console.log($scope.school);
        let passwordHash = md5.createHash($scope.adminPassword || '');
        console.log(passwordHash);
        /*$http({
          method: 'POST',
          url: '/login/requestLogin',
          data: JSON.stringify({
            name: $scope.school.name,
            passwordHash: passwordHash
          })
        })
          .then(function (responseJson) {
            console.log("got random string response " + responseJson.data.randomString);
            console.log("Rehashing " + passwordHash + " to " + md5.createHash(passwordHash + responseJson.data.randomString));
            $http({
              method: 'POST',
              url: '/login/loginSchool',
              data: JSON.stringify({
                name: $scope.school.name,
                passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
              })
            })
              .then(function () {
                console.log("login successful");
                $location.path('dashboard');
              })
              .catch(function (error) { console.error(error) })
          })
          .catch(function (error) { console.error(error) });
          */
        return false;
      }
  }]);
