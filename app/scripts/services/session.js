angular.module('mathakur')
    .service('session', ['localStorage', function (localStorage) {
        // Instantiate data when service
        // is loaded
        const levels = {noOne: -1, school: 0, admin: 1, superAdmin: 2};
        this._school = localStorage.getItem('session.school');
        this._user = localStorage.getItem('session.user');
        this._level = localStorage.getItem('session.level') || -1;
        this._lastselecteduser = localStorage.getItem('session.lastselecteduser')
        console.log(this._level);

        this.getSchool = function () {
            return this._school;
        }

        this.getUser = function () {
            return this._user;
        };

        this.getLevel = function() {
            return this._level;
        }

        this.getLastSelectedUser = function() {
            return this._lastselecteduser;
        }

        this.setUser = function (user, level) {
            this._user = user;
            this._level = level;
            localStorage.setItem('session.user', user);
            localStorage.setItem('session.level', level);
            return this;
        };

        this.setSchool = function (school, level) {
            this._school = school;
            this._level = level;
            localStorage.setItem('session.school', school);
            localStorage.setItem('session.level', level);
            return this;
        }

        this.isLoggedIn = function() {
            return this._school !== null;
        }
        /**
         * Destroy session
         */
        this.destroy = function destroy() {
            console.log("Destroying");
            if(this._level > 0) {
                this.setUser(null, 0)
            }
            else {
                this.setUser(null, -1);
            }            
        };
    }])
    .factory('localStorage', ['$window', function($window) {
        if($window.localStorage){
            return $window.localStorage;
          }
          throw new Error('Local storage support is needed');
    }]);
    