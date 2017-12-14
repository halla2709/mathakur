'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$location', '$http', 'md5', function ($scope, $rootScope, $state, $location, $http, md5) {

    $scope.school = '';
    $scope.password = '';

    $scope.submit = function () {
      console.log("submitting");
      $scope.school = JSON.parse($scope.school);
      let passwordHash = md5.createHash($scope.password || '');
      let schoolName = $scope.school.name;
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
          console.log("School name " + schoolName);
          $http({
            method: 'POST',
            url: '/login/loginSchool',
            data: JSON.stringify({
              name: schoolName,
              passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
            })
          })
            .then(function (responseJson2) {
              console.log(responseJson2);
              if (responseJson2.data.loggedIn) {
                $rootScope.session.setSchool(responseJson2.data.loggedIn, 0);
                $location.path('dashboard');
              }
              else {
                $scope.school = '';
                $scope.password = '';
              }
            })
            .catch(function (error) { console.error(error) })
        })
        .catch(function (error) { console.error(error) });

      return false;
    }

    $http.get("school")
      .then(function (response) {
        $scope.myData = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

  }]);
