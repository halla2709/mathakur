angular.module('mathakur')
.controller('ImageCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {

  $scope.$state = $state;
  $scope.imageSrc = "";
  var currentPhoto = {};

  $scope.$watch("file", function(newVal, oldVal) {
      var reader = new FileReader();
      console.log("file changed");
      console.log(newVal);
      reader.addEventListener("load", function() {
          $scope.imageSrc = reader.result;
          console.log("loaded");
      }, false);

      if(newVal) {
          reader.readAsDataURL(newVal);
          currentPhoto = newVal;
          console.log(currentPhoto);
      }
  });

  $scope.sendFile = function() {
      console.log("Sending photo");
    $http({
        method: 'POST',
        url: '/employee/photo',
        data: JSON.stringify({photo: $scope.imageSrc})
    })
        .then(function() {console.log("success")})
        .catch(function(error) {console.error(error)});
  }
}]);