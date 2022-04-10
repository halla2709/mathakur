describe('Admin Controller', function () {
  const companyName = "TestingComp";
  var AdminPanelCtrl, scope, mockServer, rootScope, q, hashfunc;
  var response;
  var sessionMock = {
    getSchool: function () { return companyName; },
    getLevel: function () { return 1; },
  }

  function fakeGet(url) {
    return Promise.resolve({ data: [] });
  }

  function fakePost(url, data) {
    return response;
  }


  beforeEach(module('mathakur'));

  beforeEach(inject(function ($controller, $rootScope, server, $q, md5) {
    q = $q;
    hashfunc = md5.createHash;
    scope = $rootScope.$new();
    rootScope = scope;
    rootScope.session = sessionMock;
    mockServer = server;
    spyOn(mockServer, 'get').and.callFake(fakeGet);
    AdminPanelCtrl = $controller("AdminPanelCtrl", { $scope: scope, server: mockServer, $rootScope: rootScope });
  }));

  it('should load controller', function () {
    expect(AdminPanelCtrl).toBeDefined();
    expect(scope.defaultEmployeePhotoUrl).toBe("tzeqj4l6kjyq0jptankn");
  });

  it('should get all data on startup', function () {
    expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyName);
    expect(mockServer.get).toHaveBeenCalledWith('food/' + companyName);
    expect(mockServer.get).toHaveBeenCalledWith('admin/' + companyName);
  });

  describe('submit employee', function() {
    it('should create a new employee and reload', function () {
      mockServer.get.calls.reset();
      scope.employeeData = [];
      spyOn(mockServer, 'post').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve({ data: { photoUrl: 'aababab' } });
        return deferred.promise;
      });
  
      scope.currentEmployee = {
        name: "Halla",
        nickname: "Holly",
        credit: 5000
      };
      scope.submitEmployee();
      expect(mockServer.post).toHaveBeenCalledOnceWith('/employee',
        jasmine.objectContaining({
          name: "Halla",
          nickname: "Holly",
          credit: 5000,
          schoolName: companyName
        }));
  
      scope.$digest();
      expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyName);
      expect(mockServer.get).not.toHaveBeenCalledWith('food/' + companyName);
      expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyName);
    });
  
    it('should update employee image when it has been uploaded and reload', function () {
      mockServer.get.calls.reset();
      spyOn(mockServer, 'patch').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
  
      scope.updating = true;
      scope.currentEmployee = {
        id: "id",
        name: "Halla",
        nickname: "Holly",
        credit: 5000
      };
      scope.image = "animagebinaryrep";
      scope.submitEmployee();
      expect(mockServer.patch).toHaveBeenCalledOnceWith('/employee/id',
        jasmine.objectContaining({
          newCredit: 5000,
          photo: scope.image
        }));
  
      scope.$digest();
      expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyName);
      expect(mockServer.get).not.toHaveBeenCalledWith('food/' + companyName);
      expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyName);
    });
  
    it('should only update employee credit when no image has been uploaded and not reload', function () {
      mockServer.get.calls.reset();
      spyOn(mockServer, 'patch').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
  
      scope.updating = true;
      scope.currentEmployee = {
        id: "id",
        name: "Halla",
        nickname: "Holly",
        credit: 5000
      };
  
      scope.submitEmployee();
      expect(mockServer.patch).toHaveBeenCalledOnceWith('/employee/updatecredit/id',
        jasmine.objectContaining({
          newCredit: 5000
        }));
  
      scope.$digest();
      expect(mockServer.get).not.toHaveBeenCalled();
    });
  
    it('should remove employee and automatically remove it from the list and not reload', function () {
      mockServer.get.calls.reset();
      scope.employeeData = [ {
        id: "id1",
        name: "Halla1",
        nickname: "Holly1",
        credit: 5001
      },
      {
        id: "id2",
        name: "Halla2",
        nickname: "Holly2",
        credit: 5002
      },
      {
        id: "id3",
        name: "Halla3",
        nickname: "Holly3",
        credit: 5003
      }];
      spyOn(mockServer, 'delete').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
      spyOn(window, 'confirm').and.returnValue(true);
  
      scope.currentEmployee = scope.employeeData[1];
  
      scope.deleteEmployee();
      scope.$digest();
      expect(mockServer.delete).toHaveBeenCalledOnceWith('/employee/id2');
      expect(scope.employeeData).toHaveSize(2);
      expect(scope.employeeData).not.toContain({
        id: "id2",
        name: "Halla2",
        nickname: "Holly2",
        credit: 5002
      });
      expect(mockServer.get).not.toHaveBeenCalled();
    });
  });

  describe('submit product', function() {
    it('should create a new product and reload', function () {
      mockServer.get.calls.reset();
      scope.foodData = [];
      spyOn(mockServer, 'post').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve({ data: { photoUrl: 'aababab' } });
        return deferred.promise;
      });
  
      scope.currentFood = {
        name: "Halla",
        category: "Holly",
        price: 5000
      };
      scope.submitFood();
      expect(mockServer.post).toHaveBeenCalledOnceWith('/food',
        jasmine.objectContaining({
          name: "Halla",
          category: "Holly",
          price: 5000,
          school: companyName
        }));
  
      scope.$digest();
      expect(mockServer.get).not.toHaveBeenCalledWith('employee/' + companyName);
      expect(mockServer.get).toHaveBeenCalledWith('food/' + companyName);
      expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyName);
    });
  
    it('should update product image when it has been uploaded and reload', function () {
      mockServer.get.calls.reset();
      spyOn(mockServer, 'patch').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
  
      scope.updating = true;
      scope.currentFood = {
        id: 'id',
        name: "Halla",
        category: "Holly",
        price: 5000
      };
      scope.image = "animagebinaryrep";
      scope.submitFood();
      expect(mockServer.patch).toHaveBeenCalledOnceWith('/food/'+companyName+'/id',
        jasmine.objectContaining({
          newPrice: 5000,
          photo: scope.image
        }));
  
      scope.$digest();
      expect(mockServer.get).not.toHaveBeenCalledWith('employee/' + companyName);
      expect(mockServer.get).toHaveBeenCalledWith('food/' + companyName);
      expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyName);
    });
  
    it('should only update food price when no image has been uploaded and not reload', function () {
      mockServer.get.calls.reset();
      spyOn(mockServer, 'patch').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
  
      scope.updating = true;
      scope.currentFood = {
        id: 'id',
        name: "Halla",
        category: "Holly",
        price: 5000
      };
  
      scope.submitFood();
      expect(mockServer.patch).toHaveBeenCalledOnceWith('/food/price/'+companyName+'/id',
        jasmine.objectContaining({
          newPrice: 5000
        }));
  
      scope.$digest();
      expect(mockServer.get).not.toHaveBeenCalled();
    });
  
    it('should delete product and automatically remove it from the list and not reload', function () {
      mockServer.get.calls.reset();
      scope.foodData = [ {
        id: "id1",
        name: "Halla1",
        category: "Holly1",
        price: 5001
      },
      {
        id: "id2",
        name: "Halla2",
        category: "Holly2",
        price: 5002
      },
      {
        id: "id3",
        name: "Halla3",
        category: "Holly3",
        price: 5003
      }];
      spyOn(mockServer, 'delete').and.callFake(function (url, data) {
        var deferred = q.defer();
        deferred.resolve();
        return deferred.promise;
      });
      spyOn(window, 'confirm').and.returnValue(true);
  
      scope.currentFood = scope.foodData[1];
  
      scope.deleteFood();
      scope.$digest();
      expect(mockServer.delete).toHaveBeenCalledOnceWith('/food/id2/'+companyName);
      expect(scope.foodData).toHaveSize(2);
      expect(scope.foodData).not.toContain({
          id: "id2",
          name: "Halla2",
          category: "Holly2",
          price: 5002
        });
      expect(mockServer.get).not.toHaveBeenCalled();
    });
  });

  describe('admin signup', function() {
    it('should not add admin if passwords do not match', function() {
      var newAdmin = {
        password: 'a',
        passwordConfirm: 'b'
      };

      spyOn(mockServer, 'post');
      scope.submitAdmin(newAdmin);
      
      expect(mockServer.post).not.toHaveBeenCalled();
      expect(scope.wrongpassword).toBeTrue();
    });

    it('should add new admin in two post requests', function() {
      mockServer.get.calls.reset();
      scope.adminData = [];
      var newAdmin = {
        password: 'a',
        passwordConfirm: 'a',
        name: 'Halla',
        username: 'holly'
      };

      var firstCall = true;
      spyOn(mockServer, 'post').and.callFake(function (url, data) {
        var deferred = q.defer();
        if (firstCall) {
          deferred.resolve( { data: { adminRandomString: 'abcdef' }} );
          firstCall = false;
        }
        else {
          deferred.resolve();
        }
        return deferred.promise;
      });
      scope.submitAdmin(newAdmin);

      expect(mockServer.post).toHaveBeenCalledWith('/login/requestAdminConnection',
      jasmine.objectContaining({
        adminPassHash: hashfunc(newAdmin.password)
      }));

      scope.$digest();
      expect(mockServer.post).toHaveBeenCalledWith('/login/signupAdmin',
      jasmine.objectContaining({
        adminPassHash: hashfunc(hashfunc(newAdmin.password) + 'abcdef'),
        adminName: newAdmin.name,
        adminUser: newAdmin.username,
        companyName: companyName
      }));

      expect(mockServer.get).not.toHaveBeenCalled();
      expect(scope.adminData).toHaveSize(1);
    });
  });
});