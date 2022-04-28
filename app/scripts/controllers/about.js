angular.module('mathakur')
    .controller('AboutCtrl', ['$scope', '$state', '$http', '$rootScope', '$location', function ($scope, $state, $http, $rootScope, $location) {

        $scope.goToStaff = function () {
            $state.go('about');
            $scope.editing = false;
            $scope.updating = false;
        }

    }]);
