angular.module('mathakur')
  .service('server', ['$http', function ($http) {
    var wrapper = {};

    wrapper.post = function (path, json) {
      return $http({
        method: 'POST',
        url: path,
        data: JSON.stringify(json)
      });
    };

    wrapper.get = function (path) {
      return $http.get(path);
    };

    wrapper.patch = function (path, json) {
      return $http({
          method: 'PATCH',
          url: path,
          data: JSON.stringify(json)
      });
    }

    wrapper.delete = function(path) {
      return $http({
          method: 'DELETE',
          url: path
      });
    }
    
    return wrapper;
  }]);