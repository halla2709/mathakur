'use strict';

/**
 * @ngdoc functions
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'server', '$timeout', function ($scope, $rootScope, $state, $stateParams, server, $timeout) {
    $scope.employee = $stateParams.param;
    $scope.receipt = [];
    $scope.sidebar = false;
    $scope.total = 0;
    $scope.total_count = 0;
    $scope.showSuccessMessage = false;

    $scope.selectStaff = function (employee) {
      server.get('employee/'+employee.id)
        .then(function(response) {
          $scope.employee = response.data;
          $scope.receipt = [];
          $scope.total = 0;
          $scope.total_count = 0;
          $scope.showErrorMessage = false;
          $scope.showSuccessMessage = false;
          $state.go("selectproduct", { param: employee });
        })
        .catch(function(error) {
          console.error("Could not update employee data");
        });
    }

    $scope.showSidebar = function (sidebar) {
      $scope.sidebar = !$scope.sidebar;
    }

    $scope.addProduct = function (product) {
      var index = -1;
      var total = 0;
      var creditAfter = $scope.employee.credit - $scope.total;

      if (($rootScope.session.isBelowZeroAllowed() != true) && (product.price > creditAfter)) {
        $scope.showErrorMessage = true;
        $scope.errorMessage = "Vöruverð er hærra en inneign"
      }
      else {
        $scope.showErrorMessage = false;
        for (var i = 0; i < $scope.receipt.length; i++) {
          var item = $scope.receipt[i];
          if (item.name === product.name) {
            item.quantity++;
            index = i;
            item.ordertotal = item.price * item.quantity;
          }
          total += item.ordertotal;
        }

        if (index == -1) {
          product.quantity = 1;
          product.ordertotal = product.price;
          $scope.receipt.push(product);
          total += product.ordertotal;
        }
        $scope.total = total;
        $scope.total_count = $scope.total_count + 1;
      }
    };

    $scope.removeProduct = function (product) {
      var total = 0;
      $scope.showErrorMessage = false;
      var index = -1;
      for (var i = 0; i < $scope.receipt.length; i++) {
        var item = $scope.receipt[i];
        if (item.name === product.name) {
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
      $scope.total_count = $scope.total_count - 1;
    }

    $scope.removeAllProduct = function (product) {
      $scope.total = 0;
      $scope.total_count = 0;
      $scope.receipt = [];
      $scope.showErrorMessage = false;
    }

    $scope.buyProduct = function (product) {

      if ($scope.total_count == 0) {
        $scope.showErrorMessage = true;
        $scope.errorMessage = "Karfan er tóm";
      }
      else {
        if ($scope.employee.credit >= $scope.total || $rootScope.session.isBelowZeroAllowed()) {
          var newCredit = $scope.employee.credit - $scope.total;
          $scope.lastTransaction = {
            creditBefore: $scope.employee.credit,
            amount: $scope.total,
            employee: $scope.employee
          }
          server.patch('employee/updatecredit/' + $scope.employee.id, {
            transaction: $scope.total
          })
            .then(function () {
              $scope.employee.credit = newCredit;
              $scope.receipt = [];
              $scope.message = "Innkaupin tókust " + $scope.employee.nickname + ", inneignin þín er nú: " + $scope.employee.credit + "kr";
              $state.go("dashboard");
              $scope.showErrorMessage = false;
              $scope.undoPossible = true;
              $scope.showSuccessMessage = true;
              $timeout(function () {
                $scope.showSuccessMessage = false;
              }, 10000);
            })
            .catch(function (error) {
              console.error(error);
              $scope.showErrorMessage = true;
              $scope.errorMessage = "Villa átti sér stað við að framkvæma færsluna";
            });


        } else {
          console.log("not enough credit");
          $scope.showErrorMessage = true;
          $scope.errorMessage = "Ekki næg inneign fyrir kaupunum";
        }
      }
    }

    $scope.localeSensitiveComparator = function (v1, v2) {
      if (v1.type !== 'string' || v2.type !== 'string') {
        return (v1.index < v2.index) ? -1 : 1;
      }

      return v1.value.localeCompare(v2.value);
    };

    $scope.undoLastTransaction = function () {
      server.patch('employee/updatecredit/' + $scope.lastTransaction.employee.id, {
        transaction: -1*$scope.lastTransaction.amount
      })
        .then(function () {
          $scope.message = "Bakfærslan tókst, inneignin þín er ennþá: " + $scope.lastTransaction.creditBefore + "kr";
          $scope.lastTransaction.employee.credit = $scope.lastTransaction.creditBefore;
          $scope.showSuccessMessage = true;
          $scope.undoPossible = false;
          $timeout(function () {
            $scope.showSuccessMessage = false;
          }, 10000);
        })
        .catch(function (error) {
          console.error(error);
          $scope.showErrorMessage = true;
          $scope.errorMessage = "Villa átti sér stað við að bakfæra færsluna";
        });
    }

    $rootScope.session.load().then(function () {
      if (!$rootScope.session.isLoggedIn()) {
        console.log("no one is logged in");
        $state.go('login');
        return;
      }

      if (!$scope.employee) {
        $state.go("dashboard");
      }

      var productPath = 'product/' + $rootScope.session.getCompanyId();
      var employeePath = 'employee/all/' + $rootScope.session.getCompanyId();

      server.get(employeePath).then(function (response) {
        $scope.myDataEmployee = response.data;
      })
        .catch(function (response) {
          //Error handle
          $scope.content = "Something went wrong";
        });

      server.get(productPath).then(function (response) {
        $scope.myDataProduct = response.data;
      })
        .catch(function (response) {
          //Error handle
          $scope.content = "Something went wrong";
        });
    });
  }]);

angular.module('mathakur').directive('errSrc', function () {
  return {
    link: function (scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
