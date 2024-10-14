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
        $scope.successAlertCopy = false;
        $scope.errorAlert = false;
        $scope.updatingCredit = false;
        $scope.quickAddedCredit = 0;
        $scope.usingQuickAdd = false;
        $scope.copyToClipboardString = "";
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

        $scope.copyEmployeeData = function() {
            var data = "";
            for (let i = 0; i < $scope.employeeData.length; i++) {
                data += $scope.employeeData[i].name + ": " + $scope.employeeData[i].credit + "kr" + "\n";
            }
            copyToClipboard(data);
        }

        function copyToClipboard(data) {
            var copyElement = document.createElement("textarea");
            copyElement.style.position = 'fixed';
            copyElement.style.opacity = '0';
            copyElement.textContent = decodeURI(data);
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(copyElement);
            copyElement.select();
            document.execCommand('copy');
            body.removeChild(copyElement);
            showSuccessMessageCopied();
        }

        $scope.quickAdd = function (x) {
            $scope.usingQuickAdd = true;
            $scope.quickAddedCredit = $scope.quickAddedCredit + x;
            $scope.currentEmployee.credit = $scope.currentEmployee.credit + x;
        }

        $scope.resetQuickAdd = function () {
            $scope.currentEmployee.credit = $scope.currentEmployee.credit - $scope.quickAddedCredit;
            $scope.quickAddedCredit = 0;
        }

        $scope.localeSensitiveComparator = function(v1, v2) {
            if (v1.type !== 'string' || v2.type !== 'string') {
              return (v1.index < v2.index) ? -1 : 1;
            }
            return v1.value.localeCompare(v2.value);
          };

        $scope.goToStaff = function () {
            $state.go('staffTable');
            $scope.editing = false;
            $scope.updating = false;
            
            $scope.successAlert = false;
            $scope.errorAlert = false;
            $scope.usingQuickAdd = false;
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
                $scope.quickAddedCredit = 0;
                $scope.currentEmployee = employee;
                server.get("employee/history/" + employee.id).then(function (response) {
                    $scope.currentEmployee.history = response.data;
                    $scope.currentEmployee.history.creditDifference = 0;
                    $scope.currentEmployee.history.forEach(entry => {
                        let products = {};
                        if (entry.productnames) {
                            entry.productnames.forEach(product => {
                                if (products[product])
                                    products[product] += 1;
                                else 
                                    products[product] = 1;
                            });
                            entry.shoppingtransaction = Object.entries(products)
                                .map(([key, value]) => `${key} x${value}`)
                                .join(', ');
                        }
                        //entry.creditDifference = entry.creditbefore - entry.creditafter;
                        if (entry.creditafter === null) {
                            entry.creditafter = entry.creditbefore;
                            entry.productprices.forEach(price => {
                                entry.creditafter -= price;
                            });
                        }
                    });
                })                
            } else {
                $scope.currentEmployee = {};
                $scope.currentEmployee.credit = 0;
                $scope.currentEmployee.active = true;
            }
            $scope.editing = true;
            $scope.usingQuickAdd = false;
        };

        $scope.createAdmin = function () {
            $scope.editing = true;
            $scope.errorAlert = false;
            $scope.newAdmin = {};
        }

        function isCompanyFrozen(error) {
            if (error.status === 403 && error.data.frozen) {
              $rootScope.session.logOutCompany();
              $state.go('login', { frozen: true });
              return true;
            }
            else {
              return false;
            }
          }

        function reloadData(employee, product, admin) {
            if (employee) {
                server.get("employee/all/" + $scope.currentCompanyLoggedIn).then(function (response) {
                    $scope.employeeData = response.data;
                })
                    .catch(function (error) {
                        if (!isCompanyFrozen(error)) {
                        //Error handle
                        $scope.content = "Something went wrong while getting employees";
                        }
                    });
            }

            if (product) {
                server.get("product/" + $scope.currentCompanyLoggedIn).then(function (response) {
                    $scope.productData = response.data;
                })
                    .catch(function (error) {
                        if (!isCompanyFrozen(error)) {
                            //Error handle
                            $scope.content = "Something went wrong while getting products";
                        }
                    });
            }

            if (admin) {
                server.get("admin/" + $scope.currentCompanyLoggedIn).then(function (response) {
                    $scope.adminData = response.data;
                })
                    .catch(function (error) {
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

        function showSuccessMessageCopied() {
            if (messageTimeout) {
                $timeout.cancel(messageTimeout);
            }
            $scope.successAlertCopy = true;
            messageTimeout = $timeout(function () {
                $scope.successAlertCopy = false;
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
                submitEmployeeUpdate(employeeID);
            } else {
                server.post('/employee', {
                    photo: $scope.currentEmployee.newImage,
                    name: $scope.currentEmployee.name,
                    nickname: $scope.currentEmployee.nickname,
                    active: $scope.currentEmployee.active,
                    credit: $scope.currentEmployee.credit,
                    companyId: $scope.currentCompanyLoggedIn,
                    adminName: $rootScope.session.getUser()
                })
                    .then(function () {
                        showSuccessMessage();
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

        function submitEmployeeUpdate(employeeID) {
            server.patch('/employee/' + employeeID, {
                newCredit: $scope.currentEmployee.credit,
                photo: $scope.currentEmployee.newImage,
                companyId: $scope.currentCompanyLoggedIn,
                newName: $scope.currentEmployee.name,
                newNickname: $scope.currentEmployee.nickname,
                newStatus: $scope.currentEmployee.active,
                adminName: $rootScope.session.getUser()
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
            if (confirm('Ertu viss um að þú viljir eyða?')) {
                server.delete('/employee/' + $scope.currentEmployee.id)
                    .then(function () {
                        const index = $scope.employeeData.indexOf($scope.currentEmployee);
                        if (index != -1) {
                            $scope.employeeData.splice(index, 1);
                        }
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
        }

        $scope.editProduct = function (product) {
            if (product) {
                $scope.updating = true;
                $scope.currentProduct = product;
            }
            else {
                $scope.currentProduct = {};
                $scope.currentProduct.active = true;
            }
            $scope.editing = true;
        }

        function submitProductUpdate(productID) {
            server.patch('/product/' + $scope.currentCompanyLoggedIn + '/' + productID, {
                newPrice: $scope.currentProduct.price,
                newName: $scope.currentProduct.name,
                photo: $scope.currentProduct.newImage,
                companyId: $scope.currentCompanyLoggedIn,
                newStatus: $scope.currentProduct.active,
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

        $scope.submitProduct = function (product) {
            if ($scope.updating) {
                var productID = $scope.currentProduct.id;
                submitProductUpdate(productID);
            } else {
                server.post('/product', {
                    photo: $scope.currentProduct.newImage,
                    name: $scope.currentProduct.name,
                    category: $scope.currentProduct.category,
                    price: $scope.currentProduct.price,
                    companyId: $scope.currentCompanyLoggedIn,
                    active: $scope.currentProduct.active
                })
                    .then(function () {
                        reloadData(false, true);
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
        }

        $scope.deleteProduct = function () {
            if (confirm('Ertu viss um að þú viljir eyða?')) {
                server.delete('/product/' + $scope.currentProduct.id + '/' + $scope.currentCompanyLoggedIn)
                    .then(function () {
                        const index = $scope.productData.indexOf($scope.currentProduct);
                        if (index !== -1) {
                            $scope.productData.splice(index, 1);
                        }
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
                                showSuccessMessage();
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
            if ($rootScope.session.isBelowZeroAllowed() != $scope.newSettings.allowfundsbelowzero) {
                server.patch('/company/' + $scope.currentCompanyLoggedIn, {
                    allowfundsbelowzero: $scope.newSettings.allowfundsbelowzero
                })
                    .then(function () {
                        $rootScope.session.onNewSettings($scope.newSettings);
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
                        showSuccessMessage();
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
                allowfundsbelowzero: $rootScope.session.isBelowZeroAllowed()
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
            $scope.newSettings.allowfundsbelowzero = $rootScope.session.isBelowZeroAllowed();
            reloadData(true, true, true);
        });

    }]);