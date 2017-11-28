'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('SelectFoodCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {


    $scope.$state = $state;
    $scope.employee = $stateParams.param;
    $scope.receipt = [];
    $scope.currentSchool = 1;
    var path = '/food/' + $scope.currentSchool;
    $scope.total = 0;


    $scope.addFood = function (food) {

      var index = -1;
      var quantity = 0;
      var ordertotal = 0;
      $scope.total += food.price;

      for (var i = 0; i < $scope.receipt.length; i++) {
        if ($scope.receipt[i].name === food.name) {
          $scope.receipt[i].quantity++;
          index = i;
          $scope.receipt[i].ordertotal = $scope.receipt[i].price * $scope.receipt[i].quantity;
          break;
        }
      }
      if (index == -1) {
        food.quantity = 1;
        food.ordertotal = food.price;
        $scope.receipt.push(food);
      }
    };

    $scope.removeFood = function (food) {
      $scope.total -= food.price;
      for (var i = 0; i < $scope.receipt.length; i++) {
        if ($scope.receipt[i].name === food.name) {
          $scope.receipt[i].quantity--;
          if ($scope.receipt[i].quantity == 0) {
            $scope.receipt.splice(i, 1);
          }
          break;
        }
      }
    }

    $scope.removeAllFood = function (food) {
      $scope.total = 0;
      for (var i = 0; i < $scope.receipt.length; i++) {
        $scope.receipt.splice(i);
      }
    }

    $scope.buyFood = function (food) {
      console.log("employee á", $scope.employee.credit);
      var credit = $scope.employee.credit;

      if (confirm('Ertu viss um að þú viljir kaupa allt í körfunni?')) {
        
        if(credit >= $scope.total)
        {
              credit -= $scope.total;
              $scope.employee.credit = credit;

              console.log(credit);

              $http({
                method: 'PATCH',
                url: 'employee/updatecredit/'+$scope.employee.id,
                data: JSON.stringify({
                    newCredit: credit
                })
          })
          console.log(credit);
          $scope.myText = "Hæ";
        }
  
        else {
          console.log("Þú átt ekki nægann pening fyrir matnum!")
          $scope.myText2 = "Bæ";
        }
    } else {
        // Do nothing!
    }     
    }

    $http.get("employee").then(function (response) {
        $scope.myDataEmployee = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

    $http.get(path).then(function (response) {
        $scope.myDataFood = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

    $http.get("school").then(function (response) {
        $scope.myDataSchool = response.data;
      })
      .catch(function (response) {
        //Error handle
        $scope.content = "Something went wrong";
      });

  }]);