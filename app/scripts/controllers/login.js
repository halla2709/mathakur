'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'server', 'md5', function ($scope, $rootScope, $state, server, md5) {

    $scope.company = '';
    $scope.password = '';
    $scope.wrongpassword = false;

    $scope.submit = function () {
      $scope.company = JSON.parse($scope.company);
      var passwordHash = md5.createHash($scope.password || '');
      var companyName = $scope.company.name;
      server.post('/login/requestCompanyConnection', {
          passwordHash: passwordHash
        })
        .then(function (responseJson) {
          server.post('/login/loginCompany', {
              companyName: companyName,
              companyPassHash: md5.createHash(passwordHash + responseJson.data.companyRandomString)
            })
            .then(function (responseJson2) {
              if (responseJson2.data.loggedIn) {
                $rootScope.session.setCompany(responseJson2.data.loggedIn, 0);
                $state.go('dashboard');
              }
              else {
                $scope.company = '';
                $scope.password = '';
                $scope.wrongpassword = true;
              }
            })
            .catch(function (error) { console.error(error) })
        })
        .catch(function (error) { console.error(error) });

      return false;
    }

    $rootScope.session.load().then(function() {
      if (!$rootScope.session.isLoggedIn())
      {
        server.get("company")
          .then(function (response) {
            $scope.myData = response.data;
          })
          .catch(function (response) {
            //Error handle
            $scope.content = "Something went wrong";
          });
      }
      else
      {
        $state.go('staff');
      }
    });

  }]);
