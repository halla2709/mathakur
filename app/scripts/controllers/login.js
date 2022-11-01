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
    $scope.filteredCompanies = [];
    //$scope.testCompanies = [{name:"Test"}, {name:"Tes2"}, {name:"Langt Nafn"}, {name:"very very very very long name"}];

    $scope.onNewSearch = function() {
      if ($scope.searchValue.length > 1) {
        $scope.filteredCompanies = $scope.allCompanies.filter(function(comp) {
          return comp.name.toLowerCase().startsWith($scope.searchValue.toLowerCase());
        })
      }
      else {
        $scope.filteredCompanies = [];
      }
    }

    $scope.goToHome = function() {
      $state.go('frontpage');
    }
    
    $scope.selectCompany = function(company) {
      $scope.company = company;
      $scope.filteredCompanies = [];
      $scope.searchValue = $scope.company.name;
    }

    $scope.submit = function () {
      if ($scope.filteredCompanies.length > 0) {
        $scope.selectCompany($scope.filteredCompanies[0]);
      }
      else {
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
              .catch(function (error) { console.warn(error) })
          })
          .catch(function (error) { console.warn(error) });
      }

      return false;
    }

    $rootScope.session.load().then(function() {
      if (!$rootScope.session.isLoggedIn())
      {
        server.get("company")
          .then(function (response) {
            $scope.allCompanies = response.data;
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
