'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('UserLoginCtrl', ['$scope', '$rootScope', '$state', 'server', 'md5', function ($scope, $rootScope, $state, server, md5) {

    $scope.username = '';
    $scope.password = '';
    $scope.wrongpassword = false;

    $scope.submit = function () {
      var passwordHash = md5.createHash($scope.password || '');
      server.post('/login/requestAdminConnection', {
          adminPassHash: passwordHash
        })
        .then(function (responseJson) {
          server.post('/login/loginUser', {
              adminUser: $scope.username,
              companyId: $rootScope.session.getCompanyId(),
              adminPassHash: md5.createHash(passwordHash + responseJson.data.adminRandomString)
            })
            .then(function (responseJson2) {
              if (responseJson2.data.loggedIn) {
                $rootScope.session.setUser(responseJson2.data.loggedIn, 1);
                $state.go('staffTable');
              }
              else {
                $scope.username = '';
                $scope.password = '';
                $scope.wrongpassword = true;
              }
            })
            .catch(function (error) {
              if (!isCompanyFrozen(error)) {
                console.warn(error);
                $scope.wrongpassword = true;
              }
            })
        })
        .catch(function (error) { 
          if (!isCompanyFrozen(error)) {
            console.warn(error);
          }
        });

      return false;
    }

    function isCompanyFrozen(error) {
      if (error.status === 403 && error.data.frozen) {
        $rootScope.session.logOutCompany();
        $state.go('login', { frozen: true });
        return true;
      }
      else {
        return false;
      }
    }

    $rootScope.session.load().then(function() {
      if(!$rootScope.session.isLoggedIn()) {
        console.log("no company is logged in");
        $state.go('login');
        return;
      }
    });

  }]);