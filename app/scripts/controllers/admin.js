angular.module('mathakur')
    .controller('AdminPanelCtrl', ['$scope', '$state', '$http', '$rootScope', '$location', function ($scope, $state, $http, $rootScope, $location) {

        if ($rootScope.session.getLevel() < 1) {
            console.log("admin is not logged in");
            $location.path('/userlogin');
        }

        $scope.$state = $state;
        $scope.currentPhoto = {};
        $scope.currentEmployee = {};
        $scope.currentFood = {};
        $scope.editing = false;
        $scope.updating = false;
        $scope.sidebar = true;
        $scope.image = '';
        $scope.currentSchoolLoggedIn = $rootScope.session.getSchool();
        $scope.defaultEmployeePhotoUrl = 'tzeqj4l6kjyq0jptankn';
        $scope.defaultFoodPhotoUrl = 'bazcykvn86tp963v8ocn';
        $scope.class = 'col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main';


        $scope.showSidebar = function (sidebar) {
            $scope.sidebar = !$scope.sidebar;

            if ($scope.sidebar) {
                $scope.class = 'col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main';
            }
            else {
                $scope.class = 'col-sm-12 col-md-12 main';
            }
        }

        $http.get("employee").then(function (response) {
            $scope.employeeData = response.data;
        })
            .catch(function (response) {
                //Error handle
                $scope.content = "Something went wrong";
            });

        $http.get("food/" + $scope.currentSchoolLoggedIn).then(function (response) {
            $scope.foodData = response.data;
        })
            .catch(function (response) {
                //Error handle
                $scope.content = "Something went wrong";
            });

        $scope.goToStaff = function () {
            $state.go('staffTable');
            $scope.editing = false;
            $scope.updating = false;
        }

        $scope.goToFood = function () {
            $state.go('foodTable');
            $scope.editing = false;
            $scope.updating = false;
        }

        $scope.uploadFile = function (event) {
            const newFile = event.target.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                $scope.image = reader.result;
            }, false);

            if (newFile.size > 0) {
                reader.readAsDataURL(newFile);
                $scope.currentPhoto = newFile;
            }
        };

        $scope.editEmployee = function (employee) {
            if (employee) {
                $scope.updating = true;
                $scope.currentEmployee = employee;
            } else {
                $scope.currentEmployee = {};
            }
            $scope.editing = true;
        };

        $scope.submitEmployee = function (employee) {
            if ($scope.updating) {
                const employeeID = $scope.currentEmployee.id;
                if ($scope.image) {
                    submitEmployeeUpdate(employeeID);
                }
                else {
                    submitEmployeeCredit(employeeID);
                }
            } else {
                $http({
                    method: 'POST',
                    url: '/employee',
                    data: JSON.stringify({
                        photo: $scope.image,
                        name: $scope.currentEmployee.name,
                        nickname: $scope.currentEmployee.nickname,
                        credit: $scope.currentEmployee.credit
                    })
                })
                    .then(function (newPhotoUrlJson) {
                        $scope.currentEmployee.photourl = newPhotoUrlJson.data.photoUrl;
                        $scope.employeeData.push($scope.currentEmployee);
                        $scope.currentEmployee = {};
                    })
                    .catch(function (error) {
                        console.error(error)
                    });
            }
            $scope.editing = false;
            $scope.updating = false;
            $scope.image = '';
            $scope.currentPhoto = {};
        }

        function submitEmployeeCredit(employeeID) {
            $http({
                method: 'PATCH',
                url: 'employee/updatecredit/' + employeeID,
                data: JSON.stringify({
                    newCredit: $scope.currentEmployee.credit
                })
            })
                .then(function () {
                    updateInformation($scope.employeeData, employeeID, $scope.currentEmployee);
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        function submitEmployeeUpdate(employeeID) {
            $http({
                method: 'PATCH',
                url: '/employee/' + employeeID,
                data: JSON.stringify({
                    newCredit: $scope.currentEmployee.credit,
                    photo: $scope.image
                })
            })
                .then(function (newPhotoUrlJson) {
                    $scope.currentEmployee.photourl = newPhotoUrlJson.data.photoUrl;
                    updateInformation($scope.employeeData, employeeID, $scope.currentEmployee);
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        $scope.editFood = function (food) {
            if (food) {
                $scope.updating = true;
                $scope.currentFood = food;
            }
            else {
                $scope.currentFood = {};
            }
            $scope.editing = true;
        }

        function submitFoodUpdate(foodID) {
            $http({
                method: 'PATCH',
                url: '/food/' + $scope.currentSchoolLoggedIn + '/' + foodID,
                data: JSON.stringify({
                    newPrice: $scope.currentFood.price,
                    photo: $scope.image
                })
            })
                .then(function (newPhotoUrlJson) {
                    $scope.currentFood.photourl = newPhotoUrlJson.data.photoUrl;
                    updateInformation($scope.foodData, foodID, $scope.currentFood);
                    $scope.editing = false;
                })
                .catch(function (error) {
                    console.error(error)
                });

        }

        function submitFoodPriceChange(foodID) {
            $http({
                method: 'PATCH',
                url: '/food/price/' + $scope.currentSchoolLoggedIn + '/' + foodID,
                data: JSON.stringify({
                    newPrice: $scope.currentFood.price
                })
            })
                .then(function (newPhotoUrlJson) {
                    updateInformation($scope.foodData, foodID, $scope.currentFood);
                    $scope.editing = false;
                })
                .catch(function (error) {
                    console.error(error)
                });
        }

        $scope.submitFood = function (food) {
            if ($scope.updating) {
                const foodID = $scope.currentFood.id;
                if ($scope.image) {
                    submitFoodUpdate(foodID);
                }
                else {
                    submitFoodPriceChange(foodID);
                }                
            } else {
                $http({
                    method: 'POST',
                    url: '/food',
                    data: JSON.stringify({
                        photo: $scope.image,
                        name: $scope.currentFood.name,
                        category: $scope.currentFood.category,
                        price: $scope.currentFood.price,
                        school: $scope.currentSchoolLoggedIn
                    })
                })
                    .then(function (newPhotoUrlJson) {
                        $scope.currentFood.photourl = newPhotoUrlJson.data.photoUrl;
                        $scope.foodData.push($scope.currentFood);
                        console.log($scope.foodData);
                        console.log($scope.currentFood.hasOwnProperty("id"));
                    })
                    .catch(function (error) {
                        console.error(error);
                        
                    });
            }
            $scope.editing = false;
            $scope.updating = false;
            $scope.image = '';
            $scope.currentPhoto = {};
            console.log(food.id);
        }

        $scope.back = function () {
            $scope.editing = false;
            $scope.updating = false;
            $scope.currentEmployee = {};
        }

        function updateInformation(table, id, updated) {
            for (let i = 0; i < table.size; i++) {
                const current = table[i];
                if (current.id === id) {
                    table[i] = updated;
                    break;
                }
            }
        }

        $scope.logOut = function () {
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