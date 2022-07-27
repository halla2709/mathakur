angular.module('mathakur')
    .controller('AdminPanelCtrl', ['$scope', '$state', 'server', '$rootScope', 'md5', '$timeout', function ($scope, $state, server, $rootScope, md5, $timeout) {

        $scope.$state = $state;
        $scope.currentEmployee = {};
        $scope.currentProduct = {};
        $scope.formAdmin = {};
        $scope.editing = false;
        $scope.updating = false;
        $scope.sidebar = true;
        $scope.defaultEmployeePhotoUrl = 'tzeqj4l6kjyq0jptankn';
        $scope.defaultProductPhotoUrl = 'bazcykvn86tp963v8ocn';
        $scope.class = 'col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main';
        $scope.newSettings = {};
        $scope.successAlert = false;
        $scope.errorAlert = false;
        var messageTimeout;

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

            $scope.successAlert = false;
            $scope.errorAlert = false;
        }

        $scope.goToProduct = function () {
            $state.go('productTable');
            $scope.editing = false;
            $scope.updating = false;

            $scope.successAlert = false;
            $scope.errorAlert = false;
        }

        $scope.goToSettings = function () {
            $state.go('settings');
            $scope.editing = false;
            $scope.updating = false;

            $scope.successAlert = false;
            $scope.errorAlert = false;
        }

        $scope.goToAdminList = function () {
            $state.go('adminsTable');
            $scope.editing = false;
            $scope.updating = false;

            $scope.successAlert = false;
            $scope.errorAlert = false;
        }

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
            $scope.errorAlert = false;
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

        function showSuccessMessage() {
            if (messageTimeout) {
                $timeout.cancel(messageTimeout);
            }
            $scope.successAlert = true;
            messageTimeout = $timeout(function () {
                $scope.successAlert = false;
                messageTimeout = null;
            }, 5000);
        }

        function showErrorMessage() {
            if (messageTimeout) {
                $timeout.cancel(messageTimeout);
            }
            $scope.errorAlert = true;
            messageTimeout = $timeout(function () {
                $scope.errorAlert = false;
                messageTimeout = null;
            }, 5000);
        }

        $scope.submitEmployee = function () {
            if ($scope.updating) {
                var employeeID = $scope.currentEmployee.id;
                if ($scope.currentEmployee.newImage) {
                    submitEmployeeUpdate(employeeID);
                }
                else {
                    submitEmployeeCredit(employeeID);
                }
            } else {
                server.post('/employee', {
                    photo: $scope.currentEmployee.newImage,
                    name: $scope.currentEmployee.name,
                    nickname: $scope.currentEmployee.nickname,
                    credit: $scope.currentEmployee.credit,
                    companyId: $scope.currentCompanyLoggedIn
                })
                    .then(function () {
                        reloadData(true);
                    })
                    .catch(function (error) {
                        showErrorMessage();
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
                .then(function () {
                    showSuccessMessage();
                })
                .catch(function (error) {
                    showErrorMessage();
                    console.error(error);
                })
                .finally(function () {
                    $scope.back();
                });
        }

        function submitEmployeeUpdate(employeeID) {
            server.patch('/employee/' + employeeID, {
                newCredit: $scope.currentEmployee.credit,
                photo: $scope.currentEmployee.newImage,
                companyId: $scope.currentCompanyLoggedIn
            })
                .then(function () {
                    showSuccessMessage();
                    reloadData(true);
                })
                .catch(function (error) {
                    showErrorMessage();
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
                        showErrorMessage();
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
                photo: $scope.currentProduct.newImage,
                companyId: $scope.currentCompanyLoggedIn
            })
                .then(function () {
                    showSuccessMessage();
                    reloadData(false, true);
                })
                .catch(function (error) {
                    showErrorMessage();
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
                .then(function () {
                    showSuccessMessage();
                })
                .catch(function (error) {
                    showErrorMessage();
                    console.error(error)
                })
                .finally(function () {
                    $scope.back();
                });
        }

        $scope.submitProduct = function (product) {
            if ($scope.updating) {
                var productID = $scope.currentProduct.id;
                if ($scope.currentProduct.newImage) {
                    submitProductUpdate(productID);
                }
                else {
                    submitProductPriceChange(productID);
                }
            } else {
                server.post('/product', {
                    photo: $scope.currentProduct.newImage,
                    name: $scope.currentProduct.name,
                    category: $scope.currentProduct.category,
                    price: $scope.currentProduct.price,
                    companyId: $scope.currentCompanyLoggedIn
                })
                    .then(function () {
                        reloadData(false, true);
                    })
                    .catch(function (error) {
                        showErrorMessage();
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
                        if (index !== -1) {
                            $scope.productData.splice(index, 1);
                        }
                    })
                    .catch(function (error) {
                        showErrorMessage();
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
                            .then(function (response) {
                                $scope.adminData.push({
                                    name: formAdmin.name,
                                    username: formAdmin.username,
                                    id: response.data.adminId
                                });
                            })
                            .catch(function (error) {
                                showErrorMessage();
                                console.error(error);
                            })
                            .finally(function () {
                                $scope.back();
                            });
                    })
                    .catch(function (error) {
                        showErrorMessage();
                        console.error(error);
                    });
            }
        }

        $scope.saveSettings = function () {
            if ($rootScope.session.isBelowZeroAllowed() != $scope.newSettings.allowFundsBelowZero) {
                server.patch('/company/' + $scope.currentCompanyLoggedIn, {
                    allowFundsBelowZero: $scope.newSettings.allowFundsBelowZero
                })
                    .then(function () {
                        showSuccessMessage();
                    })
                    .catch(function (error) {
                        showErrorMessage();
                        console.error(error);
                    });
            }
        }

        $scope.deleteAdmin = function (toDelete) {
            if (confirm('Ertu viss um að þú viljir eyða þessum stjórnanda?')) {
                server.delete('/admin/' + toDelete.id)
                    .then(function () {
                        const index = $scope.adminData.indexOf(toDelete);
                        $scope.adminData.splice(index, 1);
                    })
                    .catch(function (error) {
                        showErrorMessage();
                        console.error(error);
                    })
            }
        }

        $scope.back = function () {
            $scope.editing = false;
            $scope.updating = false;
            $scope.currentEmployee = {};
            $scope.currentProduct = {};
            $scope.formAdmin = {};
            $scope.newSettings = {
                allowFundsBelowZero: $rootScope.session.isBelowZeroAllowed()
            };
        }

        $scope.logOutAdmin = function () {
            $rootScope.session.logoutAdmin();
            $state.go('staff');
        }

        $rootScope.session.load().then(function () {
            if ($rootScope.session.getLevel() < 1) {
                console.log("admin is not logged in");
                $state.go('userlogin');
                return;
            }
            $scope.currentCompanyLoggedIn = $rootScope.session.getCompanyId();
            $scope.newSettings.allowFundsBelowZero = $rootScope.session.isBelowZeroAllowed();
            reloadData(true, true, true);
        });
    }]);