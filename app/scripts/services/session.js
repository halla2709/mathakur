angular.module('mathakur')
    .service('session', ['localStorage', 'server', function (localStorage, server) {
        // Instantiate data when service
        // is loaded
        var levels = { noOne: -1, company: 0, admin: 1, superAdmin: 2 };
        var companyId = localStorage.getItem('session.company');
        this._user = localStorage.getItem('session.user');
        this._level = parseInt(localStorage.getItem('session.level') || -1);
        this._lastselecteduser = localStorage.getItem('session.lastselecteduser');
        this.loading;

        if (companyId) {
            this._company = { id: companyId };
        }
        else {
            this._company = {};
        }

        this.getCompanyId = function () {
            return this._company.id;
        }

        this.getCompanyName = function () {
            return this._company.name;
        }

        this.getUser = function () {
            return this._user;
        };

        this.getLevel = function () {
            return this._level;
        }

        this.getLastSelectedUser = function () {
            return this._lastselecteduser;
        }

        this.setUser = function (user, level) {
            this._user = user;
            this._level = level;
            localStorage.setItem('session.user', user);
            localStorage.setItem('session.level', level);
            return this;
        };

        setCompany = function (company, level) {
            this._company = company;
            if (this._level < level)
            {
                this._level = level;
                localStorage.setItem('session.level', level);
            };
            localStorage.setItem('session.company', company.id);
            return this;
        }

        this.setCompany = setCompany;

        this.isLoggedIn = function () {
            return this._level >= 0;
        }

        this.adminIsLoggedIn = function () {
            return this._level == 1;
        }

        this.isBelowZeroAllowed = function () {
            return this._company.allowfundsbelowzero;
        }

        this.logOutCompany = function () {
            this.setUser(null, levels.noOne);
            this.setCompany({}, levels.noOne);
        };

        this.logoutAdmin = function () {
            this.setUser(null, levels.company);
        }
        this.loaded = function()
        {
            return this.getCompanyName() !== undefined;
        }

        this.onNewSettings = function(newSettings) {
            this._company.allowfundsbelowzero = newSettings.allowFundsBelowZero;
        }

        this.load = function() {
            if (this.loading)
            {
                return this.loading;
            }
            else if (this.isLoggedIn() && !this.loaded()) {
                var me = this;
                this.loading = server.get("company/" + this.getCompanyId())
                    .then(function (response) {
                        if (response.data.length === 1) {
                            me.setCompany(response.data[0], levels.company);
                        }
                        this.loading = new Promise((res, err) => {
                            res();
                        });
                    })
                    .catch(function (response) {
                        console.error("Could not fetch company " + response)
                    });
                return this.loading;
            }
            else {
                this.loading = new Promise((res, err) => {
                    res();
                });
                return this.loading;
            }
        }
    }])
    .factory('localStorage', ['$window', function ($window) {
        if ($window.localStorage) {
            return $window.localStorage;
        }
        throw new Error('Local storage support is needed');
    }]);
