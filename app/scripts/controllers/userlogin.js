'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('UserLoginCtrl', ['$scope', '$rootScope', '$state', '$location', '$http', 'md5', function ($scope, $rootScope, $state, $location, $http, md5) {

    $scope.username = '';
    $scope.password = '';
    $scope.wrongpassword = '';

    if($rootScope.session.getLevel() < 0) {
      console.log("no school is logged in");
      $location.path('/login');
    }

    $scope.submit = function () {
      console.log("submitting");
      let passwordHash = md5.createHash($scope.password || '');
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
          console.log("User name " + $scope.username);
          $http({
            method: 'POST',
            url: '/login/loginUser',
            data: JSON.stringify({
              username: $scope.username,
              schoolName: $rootScope.session.getSchool(),
              passwordHash: md5.createHash(passwordHash + responseJson.data.randomString)
            })
          })
            .then(function (responseJson2) {
              console.log(responseJson2);
              if (responseJson2.data.loggedIn) {
                $rootScope.session.setUser(responseJson2.data.loggedIn, 1);
                $location.path('adminpanel/staffTable');
              }
              else {
                $scope.username = '';
                $scope.password = '';
                $scope.wrongpassword = 'Eitthvað fór úrskeiðis, sláðu inn rétt lykilorð og reyndu aftur.';
              }
            })
            .catch(function (error) { console.error(error) })
        })
        .catch(function (error) { console.error(error) });

      return false;
    }

  }]);