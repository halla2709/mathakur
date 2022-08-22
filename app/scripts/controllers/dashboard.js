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
    $scope.creditAfter = 0;
    $scope.showSuccessMessage = false;

    $scope.selectStaff = function (employee) {
      $scope.employee = employee;
      $state.go("selectproduct", { param: employee });
      $scope.creditAfter = employee.credit;
    }

    $scope.showSidebar = function (sidebar) {
      $scope.sidebar = !$scope.sidebar;
    }

    $scope.addProduct = function (product) {
      var index = -1;
      var total = 0;
      
      if(($rootScope.session.isBelowZeroAllowed() != true) && (product.price > $scope.creditAfter))
      {
          $scope.notEnoughCredit = true;
          $scope.message2 = "Vöruverð er hærra en inneign"
      }
      else
      {
          $scope.notEnoughCredit = false;
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
        $scope.total_count = $scope.total_count+1;
        $scope.creditAfter = $scope.employee.credit - $scope.total;
      }
    };

    $scope.removeProduct = function (product) {
      var total = 0;
      $scope.notEnoughCredit = false;
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
      $scope.total_count = $scope.total_count-1;
      $scope.creditAfter = $scope.employee.credit - $scope.total;
    }

    $scope.removeAllProduct = function (product) {
      $scope.total = 0;
      $scope.total_count = 0;
      $scope.creditAfter = $scope.employee.credit;
      $scope.receipt = [];
      $scope.notEnoughCredit = false;
    }

    $scope.buyProduct = function (product) {
      var credit = $scope.employee.credit;
      $scope.creditAfter = $scope.employee.credit;

      if($scope.total_count == 0)
       {
        $scope.notEnoughCredit = true;
        $scope.message2 = "Karfan er tóm";
       }
       else
       {
        if (credit >= $scope.total || $rootScope.session.isBelowZeroAllowed()) {
          if (confirm('Ertu viss um að þú viljir kaupa allt í körfunni?')) {
            credit -= $scope.total;
            $scope.employee.credit = credit;
  
            server.patch('employee/updatecredit/' + $scope.employee.id, {
              newCredit: credit
            });
            $scope.receipt = [];
            $scope.message = "Innkaupin tókust " + $scope.employee.nickname + ", inneignin þín er nú: " + $scope.employee.credit + " kr";
            $scope.total = 0;
            $scope.employee = null;
            $scope.creditAfter = 0;
            $scope.total_count = 0;
             $state.go("dashboard");
            
            $scope.showSuccessMessage = true; 
            $timeout( function() {
              $scope.showSuccessMessage = false;
            }, 5000);  
          }
  
        } else {
          $scope.notEnoughCredit = true;
          $scope.message2 = "Ekki næg inneign fyrir kaupunum";
        }
       }

     
    }

    $scope.localeSensitiveComparator = function(v1, v2) {
      if (v1.type !== 'string' || v2.type !== 'string') {
        return (v1.index < v2.index) ? -1 : 1;
      }

      return v1.value.localeCompare(v2.value);
    };

    $rootScope.session.load().then(function() {
      if (!$rootScope.session.isLoggedIn()) {
        console.log("no one is logged in");
        $state.go('login');
        return;
      }

      if (!$scope.employee)
      {
        $state.go("dashboard");
      }

      var productPath = 'product/' + $rootScope.session.getCompanyId();
      var employeePath = 'employee/' + $rootScope.session.getCompanyId();

      server.get(employeePath).then(function (response) {
        //response.data.sort(function (a, b) {
          //if (a.name < b.name) return -1;
          //if (a.name > b.name) return 1;
          //return 0;
        //});
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

  angular.module('mathakur').directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    }
  });
