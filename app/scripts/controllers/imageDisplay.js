'use strict';

angular.module('mathakur')
  .directive('imagedisplay', function () {
    return {
      templateUrl: '../../views/modules/imageDisplay.html',
      restrict: 'E',
      scope: {
        container: '=',
        editingWatch: '='
      },
      link: function (scope, element) {
        scope.uploadImage = false;
        var fileInput = element.find("input");

        function uploadFile(event) {
          var newFile = event.target.files[0];
          var reader = new FileReader();
          reader.addEventListener("load", function () {
            scope.container.newImage = reader.result;
            scope.$apply();
          }, false);

          if (newFile.size > 0) {
            reader.readAsDataURL(newFile);
          }
        };

        fileInput.bind('change', uploadFile);
        
        scope.startImageUpload = function() {
          scope.uploadImage = true;
        }

        scope.$watch('editingWatch', function(newValue) {
          if (newValue) {
            fileInput.val(null);
            scope.uploadImage = false;
          }
      }, true);
      }
    }

  });
