'use strict';

/**
 * @ngdoc functions
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'server', '$location', '$window', function ($scope, $rootScope, $state, $stateParams, server, $location, $window) {

    if ($rootScope.session.getLevel() < 0) {
      console.log("no one is logged in");
      $location.path('/login');
    }

    $scope.employee = $stateParams.param;
    $scope.receipt = [];
    $scope.sidebar = false;
    var foodPath = 'food/' + $rootScope.session.getSchool();
    var employeePath = 'employee/' + $rootScope.session.getSchool();
    $scope.total = 0;
    $scope.creditAfter = 0;

    $scope.selectStaff = function (employee) {
      $scope.employee = employee;
      $state.go("selectfood", { param: employee });
      $scope.creditAfter = employee.credit;
    }

    $scope.showSidebar = function (sidebar) {
      $scope.sidebar = !$scope.sidebar;
    }

    $scope.addFood = function (food) {
      var index = -1;
      var total = 0;

      for (var i = 0; i < $scope.receipt.length; i++) {
        var item = $scope.receipt[i];
        if (item.name === food.name) {
          item.quantity++;
          index = i;
          item.ordertotal = item.price * item.quantity;
        }
        total += item.ordertotal;
      }
      if (index == -1) {
        food.quantity = 1;
        food.ordertotal = food.price;
        $scope.receipt.push(food);
        total += food.ordertotal;
      }

      $scope.total = total;
      $scope.creditAfter = $scope.employee.credit - $scope.total;
    };

    $scope.removeFood = function (food) {
      var total = 0;
      var index = -1;
      for (var i = 0; i < $scope.receipt.length; i++) {
        var item = $scope.receipt[i];
        if (item.name === food.name) {
          item.quantity--;
          if (item.quantity == 0) {
            index = i;
          }
        }
        item.ordertotal = item.price * item.quantity;
        total += item.ordertotal;
      }
      if (index !== -1) {
        $scope.receipt.splice(index, 1);
      }
      $scope.total = total;
      $scope.creditAfter = $scope.employee.credit - $scope.total;
    }

    $scope.removeAllFood = function (food) {
      $scope.total = 0;
      $scope.creditAfter = $scope.employee.credit;
      $scope.receipt = [];
    }

    $scope.buyFood = function (food) {
      var credit = $scope.employee.credit;
      $scope.creditAfter = $scope.employee.credit;

      if (credit >= $scope.total || $rootScope.session.isBelowZeroAllowed()) {
        if (confirm('Ertu viss um að þú viljir kaupa allt í körfunni?')) {
          credit -= $scope.total;
          $scope.employee.credit = credit;

          server.patch('employee/updatecredit/' + $scope.employee.id, {
            newCredit: credit
          });
          $scope.receipt = [];
          $scope.total = 0;
          $scope.employee = null;
          $scope.creditAfter = 0;
          $scope.showSuccessMessage = true;
          $state.go("dashboard");
        }
      } else {
        $scope.notEnoughCredit = true;
      }
    }

    server.get(employeePath).then(function (response) {
      response.data.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      $scope.myDataEmployee = response.data;
    })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

    server.get(foodPath).then(function (response) {
      $scope.myDataFood = response.data;
    })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

    $scope.logOut = function () {
      $rootScope.session.destroy();
      $location.path('/login');
    }
  }]);
