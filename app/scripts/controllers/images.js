angular.module('mathakur')
    .controller('ImageCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        $scope.$state = $state;
        $scope.image = {src: "", file: {}};
        var currentPhoto = {};

        $scope.$watch('image.file', function (newVal, oldVal) {
            var reader = new FileReader();
            console.log("file changed");
            console.log(newVal);
            reader.addEventListener("load", function () {
                $scope.image.src = reader.result;
                console.log("loaded");
            }, false);

            if (newVal.size > 0) {
                reader.readAsDataURL(newVal);
                currentPhoto = newVal;
                console.log(currentPhoto);
            }
        }, true);

        $scope.sendFile = function () {
            console.log("Sending photo");
            $http({
                method: 'POST',
                url: '/employee',
                data: JSON.stringify({ photo: $scope.image.src, name: "Unnur", credit: 100 })
            })
                .then(function () { console.log("success") })
                .catch(function (error) { console.error(error) });
        }
    }]);