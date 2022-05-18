angular.module('mathakur')
    .service('session', ['localStorage', 'server', function (localStorage, server) {
        // Instantiate data when service
        // is loaded

        // todo vera viss um að þessi loadi fyrst
        var levels = { noOne: -1, school: 0, admin: 1, superAdmin: 2 };
        var schoolId = localStorage.getItem('session.school');
        this._user = localStorage.getItem('session.user');
        this._level = parseInt(localStorage.getItem('session.level') || -1);
        this._lastselecteduser = localStorage.getItem('session.lastselecteduser');
        this.loading;

        if (schoolId) {
            this._school = { id: schoolId };
        }
        else {
            this._school = {};
        }

        this.getSchoolId = function () {
            return this._school.id;
        }

        this.getSchoolName = function () {
            return this._school.name;
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

        setSchool = function (school, level) {
            this._school = school;
            this._level = level;
            localStorage.setItem('session.school', school.id);
            localStorage.setItem('session.level', level);
            return this;
        }

        this.setSchool = setSchool;

        this.isLoggedIn = function () {
            return this._level >= 0;
        }

        this.isBelowZeroAllowed = function () {
            return this._school.allowFundsBelowZero;
        }

        /**
         * Destroy session
         */
        this.destroy = function () {
            if (this._level > 0) {
                this.setUser(null, 0)
            }
            else {
                this.setUser(null, -1);
                this.setSchool({}, -1);
            }
        };

        this.loaded = function()
        {
            return this.getSchoolName() !== undefined;
        }

        this.load = function() {
            if (this.loading)
            {
                return this.loading;
            }
            else if (this.isLoggedIn() && !this.loaded()) {
                var me = this;
                this.loading = server.get("school/" + this.getSchoolId())
                    .then(function (response) {
                        if (response.data.length === 1) {
                            me.setSchool(response.data[0], 0);
                        }
                        this.loading = new Promise((res, err) => {
                            res();
                        });
                    })
                    .catch(function (response) {
                        console.error("Could not fetch school " + response)
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
