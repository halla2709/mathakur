angular.module('mathakur')
    .controller('AdminPanelCtrl', ['$scope', '$state', 'server', '$rootScope', 'md5', function ($scope, $state, server, $rootScope, md5) {
        

        $scope.$state = $state;
        $scope.currentEmployee = {};
        $scope.currentProduct = {};
        $scope.editing = false;
        $scope.updating = false;
        $scope.sidebar = true;
        $scope.image = '';
        $scope.defaultEmployeePhotoUrl = 'tzeqj4l6kjyq0jptankn';
        $scope.defaultProductPhotoUrl = 'bazcykvn86tp963v8ocn';
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

        $scope.goToStaff = function () {
            $state.go('staffTable');
            $scope.editing = false;
            $scope.updating = false;
        }

        $scope.goToProduct = function () {
            $state.go('productTable');
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

        function reloadData(employee, product, admin) {
            if (employee) {
                server.get("employee/" + $scope.currentCompanyLoggedIn).then(function (response) {
                    $scope.employeeData = response.data;
                })
                    .catch(function (response) {
                        //Error handle
                        $scope.content = "Something went wrong while getting employees";
                    });
            }

            if (product) {
                server.get("product/" + $scope.currentCompanyLoggedIn).then(function (response) {
                    $scope.productData = response.data;
                })
                    .catch(function (response) {
                        //Error handle
                        $scope.content = "Something went wrong while getting products";
                    });
            }

            if (admin) {
                server.get("admin/" + $scope.currentCompanyLoggedIn).then(function (response) {
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
                    companyId: $scope.currentCompanyLoggedIn
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

        $scope.editProduct = function (product) {
            if (product) {
                $scope.updating = true;
                $scope.currentProduct = product;
            }
            else {
                $scope.currentProduct = {};
            }
            $scope.editing = true;
        }

        function submitProductUpdate(productID) {
            server.patch('/product/' + $scope.currentCompanyLoggedIn + '/' + productID, {
                newPrice: $scope.currentProduct.price,
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

        function submitProductPriceChange(productID) {
            server.patch('/product/price/' + $scope.currentCompanyLoggedIn + '/' + productID, {
                newPrice: $scope.currentProduct.price
            })
                .catch(function (error) {
                    console.error(error)
                })
                .finally(function () {
                    $scope.back();
                });
        }

        $scope.submitProduct = function (product) {
            if ($scope.updating) {
                var productID = $scope.currentProduct.id;
                if ($scope.image) {
                    submitProductUpdate(productID);
                }
                else {
                    submitProductPriceChange(productID);
                }
            } else {
                server.post('/product', {
                    photo: $scope.image,
                    name: $scope.currentProduct.name,
                    category: $scope.currentProduct.category,
                    price: $scope.currentProduct.price,
                    companyId: $scope.currentCompanyLoggedIn
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

        $scope.deleteProduct = function () {
            if (confirm('Ertu viss um að þú viljir eyða þessari vöru?')) {
                server.delete('/product/' + $scope.currentProduct.id + '/' + $scope.currentCompanyLoggedIn)
                    .then(function () {
                        const index = $scope.productData.indexOf($scope.currentProduct);
                        if (index !== -1)
                        {
                            $scope.productData.splice(index, 1);                            
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
                                companyId: $scope.currentCompanyLoggedIn
                            })
                            .then(function() {
                                $scope.adminData.push({
                                    name: formAdmin.name,
                                    username: formAdmin.username
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
            $scope.currentProduct = {};
        }

        $scope.logOutAdmin = function () {
            $rootScope.session.destroy();
            $state.go('staff');
        }
        
        $rootScope.session.load().then(function() {
            if ($rootScope.session.getLevel() < 1) {
                console.log("admin is not logged in");
                $state.go('userlogin');
                return;
            }
            $scope.currentCompanyLoggedIn = $rootScope.session.getCompanyId();
    
            reloadData(true, true, true);
        });
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