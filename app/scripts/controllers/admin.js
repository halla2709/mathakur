angular.module('mathakur')
    .controller('AdminPanelCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        $scope.$state = $state;

        $http.get("employee").then(function (response) {
            $scope.employeeData = response.data;
            console.log($scope.employeeData);
        })
            .catch(function (response) {
                //Error handle
                $scope.content = "Something went wrong";
            });

        $http.get("food").then(function (response) {
            $scope.foodData = response.data;
            console.log($scope.foodData);            
        })
            .catch(function (response) {
                //Error handle
                $scope.content = "Something went wrong";
            });


    }]);