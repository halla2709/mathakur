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
    $scope.wrongpassword = '';

    $scope.submit = function () {
      $scope.school = JSON.parse($scope.school);
      var passwordHash = md5.createHash($scope.password || '');
      var schoolName = $scope.school.name;
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
            url: '/login/loginSchool',
            data: JSON.stringify({
              name: schoolName,
              passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
            })
          })
            .then(function (responseJson2) {
              if (responseJson2.data.loggedIn) {
                $rootScope.session.setSchool(responseJson2.data.loggedIn, 0);
                $location.path('dashboard');
              }
              else {
                $scope.school = '';
                $scope.password = '';
                $scope.wrongpassword = 'Eitthvað fór úrskeiðis, sláðu inn rétt lykilorð og reyndu aftur.';
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
