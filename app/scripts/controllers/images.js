angular.module('mathakur')
    .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
            }
        };
    })
    .controller('ImageCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        $scope.$state = $state;
        $scope.image = { src: "", file: {} };
        var currentPhoto = {};

        $scope.uploadFile = function(event) {
            var newFile = event.target.files[0];
            var reader = new FileReader();
            console.log("file changed");
            console.log(newFile);
            reader.addEventListener("load", function () {
                $scope.image.src = reader.result;
                console.log("loaded");
            }, false);

            if (newFile.size > 0) {
                reader.readAsDataURL(newFile);
                currentPhoto = newFile;
                console.log(currentPhoto);
            }
        };

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