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
      var passwordHash = md5.createHash($scope.password || '');
      $http({
        method: 'POST',
        url: '/login/requestAdminConnection',
        data: JSON.stringify({
          adminPassHash: passwordHash
        })
      })
        .then(function (responseJson) {
          $http({
            method: 'POST',
            url: '/login/loginUser',
            data: JSON.stringify({
              adminUser: $scope.username,
              companyName: $rootScope.session.getSchool(),
              adminPassHash: md5.createHash(passwordHash + responseJson.data.adminRandomString)
            })
          })
            .then(function (responseJson2) {
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