angular.module('mathakur')
    .controller('AdminPanelCtrl', ['$scope', '$state', '$http', '$rootScope', '$location', function ($scope, $state, $http, $rootScope, $location) {
        
        if($rootScope.session.getLevel() < 1) {
            console.log("admin is not logged in");
            $location.path('/userlogin');
          }
        
        $scope.$state = $state;
        $scope.currentPhoto = {};
        $scope.currentEmployee = {};
        $scope.currentFood = {};
        $scope.editing = false;
        $scope.updating = false;
        $scope.image = '';
        $scope.defaultEmployeePhotoUrl = 'flat-avatar_schlbg';
        $scope.defaultFoodPhotoUrl = 'sample';


        $http.get("employee").then(function (response) {
            console.log("getting data");
            $scope.employeeData = response.data;
            console.log($scope.employeeData);
        })
            .catch(function (response) {
                //Error handle
                $scope.content = "Something went wrong";
            });

        $http.get("food/1").then(function (response) {
            $scope.foodData = response.data;
            console.log($scope.foodData);
        })
            .catch(function (response) {
                //Error handle
                $scope.content = "Something went wrong";
            });

        //TODO get food table for only this school and filter
        $scope.goToStaff = function() {
            $state.go('staffTable');
        }

        $scope.goToFood = function() {
            $state.go('foodTable');
        }

        $scope.uploadFile = function(event) {
            const newFile = event.target.files[0];
            var reader = new FileReader();
            console.log("file changed");
            console.log(newFile);
            reader.addEventListener("load", function () {
                $scope.image = reader.result;
                console.log("loaded");
            }, false);

            if (newFile.size > 0) {
                reader.readAsDataURL(newFile);
                $scope.currentPhoto = newFile;
                console.log($scope.currentPhoto);
            }
        };

        $scope.editEmployee = function(employee) {
            if (employee) $scope.updating = true;
            $scope.currentEmployee = employee;
            $scope.editing = true;
        };

        $scope.submitEmployee = function(employee) {
            $scope.currentEmployee = employee;
            const hasImage = $scope.image !== '';
            if ($scope.updating) {
                const employeeID = $scope.currentEmployee.id;
                $http({
                    method: 'PATCH',
                    url: '/employee/'+employeeID,
                    data: JSON.stringify({
                        newCredit: $scope.currentEmployee.credit,
                        photo: $scope.image
                    })
                })
                    .then(function(newPhotoUrlJson) { 
                        console.log("updated employee" +  employeeID);
                        if(hasImage) $scope.currentEmployee.photourl = newPhotoUrlJson.photoUrl;
                        updateInformation($scope.employeeData, employeeID, $scope.currentEmployee);
                    })
                    .catch(function(error) { console.error(error)});
            }
            else {
                console.log($scope.currentEmployee);
                $http({
                method: 'POST',
                url: '/employee',
                data: JSON.stringify({ 
                    photo: $scope.image, 
                    name: $scope.currentEmployee.name,
                    nickname: $scope.currentEmployee.nickname, 
                    credit: $scope.currentEmployee.credit })
            })
                .then(function (newPhotoUrlJson) { 
                    console.log("created new employee");
                    if(hasImage) $scope.currentEmployee.photourl = newPhotoUrlJson.photoUrl;
                    $scope.employeeData.push($scope.currentEmployee);
                })
                .catch(function (error) { console.error(error) });
            }
            $scope.editing = false;
            $scope.updating = false;
            $scope.image = '';
        }

        $scope.editFood = function(food) {
            if (food) $scope.updating = true;
            $scope.currentFood = food;
            $scope.editing = true;
        }

        $scope.submitFood = function(food) {
            $scope.currentFood = food;
            const hasImage = $scope.image !== '';
            if ($scope.updating) {
                const foodID = $scope.currentFood.id;
                $http({
                    method: 'PATCH',
                    url: '/food/1/'+foodID,
                    data: JSON.stringify({
                        newPrice: $scope.currentFood.price,
                        photo: $scope.image
                    })
                })
                    .then(function(newPhotoUrlJson) { 
                        console.log("updated food" +  foodID);
                        if(hasImage) $scope.currentFood.photourl = newPhotoUrlJson.photoUrl;
                        updateInformation($scope.foodData, foodID, $scope.currentFood);
                    })
                    .catch(function(error) { console.error(error)});
            }
            else {
                console.log($scope.currentFood);
                $http({
                method: 'POST',
                url: '/food',
                data: JSON.stringify({ 
                    photo: $scope.image, 
                    name: $scope.currentFood.name,
                    category: $scope.currentFood.category, 
                    price: $scope.currentFood.price })
            })
                .then(function (newPhotoUrlJson) { 
                    console.log("created new food");
                    if(hasImage) $scope.currentFood.photourl = newPhotoUrlJson.photoUrl;
                    $scope.foodData.push($scope.currentFood);
                })
                .catch(function (error) { console.error(error) });
            }
            $scope.editing = false;
            $scope.updating = false;
            $scope.image = '';
        }

        $scope.back = function() {
            $scope.editing = false;
        }

        function updateInformation(table, id, updated) {
            for(let i = 0; i < table.size; i++) {
                const current = table[i];
                if(current.id === id) {
                    table[i] = updated;
                    break;
                }
            }
        }

        $scope.logOut = function() {
            $rootScope.session.destroy();
            $location.path('/dashboard/staff');
          }

        
    }])
    .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
            }
        };
    });
