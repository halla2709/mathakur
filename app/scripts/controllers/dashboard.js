'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('mathakur')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$location', '$window', function ($scope, $rootScope, $state, $stateParams, $http, $location, $window) {

    if($rootScope.session.getLevel() < 0) {
      console.log("no one is logged in");
      $location.path('/login');
    }
      
    $scope.$state = $state;
    $scope.employee = $stateParams.param;
    $scope.receipt = [];
    $scope.editing = false;
    $scope.sidebar = false;
    var path = '/food/' + $rootScope.session.getSchool();
    $scope.total = 0;
    $scope.class = 'col-sm-12 col-md-12 main';
    $scope.class2 = 'col-sm-8 cool';
    $scope.myText3 = '';

    $scope.selectStaff = function(employee) {
      $state.go("selectfood", {param:employee});
    }


    $scope.showSidebar = function (sidebar){
      $scope.sidebar = !$scope.sidebar;
      
      if($scope.sidebar)
      {
        $scope.class = 'col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main';
        $scope.class2 = 'col-sm-2 col-md-2 cool';
      }
      else {
        $scope.class = 'col-sm-12 col-md-12 main';
        $scope.class2 = 'col-sm-1 col-md-1 cool';
      }
    }

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
      var credit = $scope.employee.credit;

      if (confirm('Ertu viss um að þú viljir kaupa allt í körfunni?')) {
        
        if(credit >= $scope.total)
        {
              credit -= $scope.total;
              $scope.employee.credit = credit;

              $http({
                method: 'PATCH',
                url: 'employee/updatecredit/'+$scope.employee.id,
                data: JSON.stringify({
                    newCredit: credit
                })
          })
            if(confirm('Til hamingju! þér hefur tekist að versla allt í körfunni, eigðu góðann dag!')) {
              $window.location.href = '/#/dashboard/staff';
              
            }
            else {
              $window.location.href = '/#/dashboard/staff';
              $scope.myText3 = "Þér hefur tekist að kaupa allt í körfunni! Eigðu góðan dag.";
            }
          $window.location.href = '/#/dashboard/staff';
          $scope.myText3 = "Hæ";
          

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
//Instaed of Path there should be "food" NEEDS TO BE CHANGED
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

      $scope.logOut = function() {
        $rootScope.session.destroy();
        $location.path('/login');
      }

  }]);
