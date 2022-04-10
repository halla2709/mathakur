angular.module('mathakur')
    .controller('AdminPanelCtrl', ['$scope', '$state', 'server', '$rootScope', '$location', 'md5', function ($scope, $state, server, $rootScope, $location, md5) {
        if ($rootScope.session.getLevel() < 1) {
            console.log("admin is not logged in");
            $location.path('/userlogin');
        }

        $scope.$state = $state;
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

        reloadData(true, true, true);

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

        $scope.goToSettings = function () {
            $state.go('settings');
            $scope.editing = false;
            $scope.updating = false;
        }

        $scope.uploadFile = function (event) {
            var newFile = event.target.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                $scope.image = reader.result;
            }, false);

            if (newFile.size > 0) {
                reader.readAsDataURL(newFile);
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

        $scope.createAdmin = function () {
            $scope.editing = true;
            $scope.newAdmin = {};
        }

        function reloadData(employee, food, admin) {
            if (employee) {
                server.get("employee/" + $scope.currentSchoolLoggedIn).then(function (response) {
                    $scope.employeeData = response.data;
                })
                    .catch(function (response) {
                        //Error handle
                        $scope.content = "Something went wrong while getting employees";
                    });
            }

            if (food) {
                server.get("food/" + $scope.currentSchoolLoggedIn).then(function (response) {
                    $scope.foodData = response.data;
                })
                    .catch(function (response) {
                        //Error handle
                        $scope.content = "Something went wrong while getting products";
                    });
            }

            if (admin) {
                server.get("admin/" + $scope.currentSchoolLoggedIn).then(function (response) {
                    $scope.adminData = response.data;
                })
                    .catch(function (response) {
                        //Error handle
                        $scope.content = "Something went wrong while getting admins";
                    });
            }
        }

        $scope.submitEmployee = function () {
            if ($scope.updating) {
                var employeeID = $scope.currentEmployee.id;
                if ($scope.image) {
                    submitEmployeeUpdate(employeeID);
                }
                else {
                    submitEmployeeCredit(employeeID);
                }
            } else {
                server.post('/employee', {
                    photo: $scope.image,
                    name: $scope.currentEmployee.name,
                    nickname: $scope.currentEmployee.nickname,
                    credit: $scope.currentEmployee.credit,
                    schoolName: $scope.currentSchoolLoggedIn
                })
                    .then(function () {
                        reloadData(true);
                    })
                    .catch(function (error) {
                        console.error(error)
                    })
                    .finally(function () {
                        $scope.back();
                    });
            }
        }

        function submitEmployeeCredit(employeeID) {
            server.patch('/employee/updatecredit/' + employeeID,
                {
                    newCredit: $scope.currentEmployee.credit
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    $scope.back();
                });
        }

        function submitEmployeeUpdate(employeeID) {
            server.patch('/employee/' + employeeID, {
                newCredit: $scope.currentEmployee.credit,
                photo: $scope.image
            })
                .then(function() {
                    reloadData(true);
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    $scope.back();
                });
        }

        $scope.deleteEmployee = function () {
            if (confirm('Ertu viss um að þú viljir eyða þessum starfsmanni?')) {
                server.delete('/employee/' + $scope.currentEmployee.id)
                    .then(function () {
                        const index = $scope.employeeData.indexOf($scope.currentEmployee);
                        if (index != -1) {
                            $scope.employeeData.splice(index, 1);
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
                    .finally(function () {
                        $scope.back();
                    });
            }
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
            server.patch('/food/' + $scope.currentSchoolLoggedIn + '/' + foodID, {
                newPrice: $scope.currentFood.price,
                photo: $scope.image
            })
                .then(function() {
                    reloadData(false, true);
                })
                .catch(function (error) {
                    console.error(error)
                })
                .finally(function () {
                    $scope.back();
                });
        }

        function submitFoodPriceChange(foodID) {
            server.patch('/food/price/' + $scope.currentSchoolLoggedIn + '/' + foodID, {
                newPrice: $scope.currentFood.price
            })
                .catch(function (error) {
                    console.error(error)
                })
                .finally(function () {
                    $scope.back();
                });
        }

        $scope.submitFood = function (food) {
            if ($scope.updating) {
                var foodID = $scope.currentFood.id;
                if ($scope.image) {
                    submitFoodUpdate(foodID);
                }
                else {
                    submitFoodPriceChange(foodID);
                }
            } else {
                server.post('/food', {
                    photo: $scope.image,
                    name: $scope.currentFood.name,
                    category: $scope.currentFood.category,
                    price: $scope.currentFood.price,
                    school: $scope.currentSchoolLoggedIn
                })
                    .then(function () {
                        reloadData(false, true);
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
                    .finally(function () {
                        $scope.back();
                    });
            }
        }

        $scope.deleteFood = function () {
            if (confirm('Ertu viss um að þú viljir eyða þessum mat?')) {
                server.delete('/food/' + $scope.currentFood.id + '/' + $scope.currentSchoolLoggedIn)
                    .then(function () {
                        const index = $scope.foodData.indexOf($scope.currentFood);
                        if (index !== -1)
                        {
                            $scope.foodData.splice(index, 1);                            
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
                    .finally(function () {
                        $scope.back();
                    });
            }
        }

        $scope.submitAdmin = function (formAdmin) {
            if (formAdmin.password !== formAdmin.passwordConfirm) {
                $scope.wrongpassword = true;
            }
            else {
                $scope.wrongpassword = false;
                var pass = md5.createHash(formAdmin.password);
                server.post('/login/requestAdminConnection', {
                        adminPassHash: pass
                    })
                    .then(function (response) {
                        server.post('/login/signupAdmin', {
                                adminPassHash: md5.createHash(pass + response.data.adminRandomString),
                                adminName: formAdmin.name,
                                adminUser: formAdmin.username,
                                companyName: $scope.currentSchoolLoggedIn
                            })
                            .then(function() {
                                $scope.adminData.push({
                                    name: formAdmin.name,
                                    username: formAdmin.username,
                                    schoolName: $scope.currentSchoolLoggedIn
                                });
                            })
                            .catch(function (error) {
                                console.error(error);
                            })
                            .finally(function () {
                                $scope.back();
                            });
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }
        }

        $scope.back = function () {
            $scope.editing = false;
            $scope.updating = false;
            $scope.image = '';
            $scope.currentEmployee = {};
            $scope.currentFood = {};
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