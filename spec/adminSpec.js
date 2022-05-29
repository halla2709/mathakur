describe('Admin Controller', function () {
  const companyId = "abcd-1234-7894-6549-efgd";
  var AdminPanelCtrl, scope, mockServer, rootScope, hashfunc;
  var getSpy;
  var sessionMock = {
    getCompanyId: function () { return companyId; },
    getLevel: function () { return 1; },
    load: function() {
      return { then: function(cb) {
        cb();
      }};
    }
  }

  beforeEach(module('mathakur'));

  beforeEach(inject(function ($controller, $rootScope, server, md5) {
    hashfunc = md5.createHash;
    scope = $rootScope.$new();
    rootScope = scope;
    rootScope.session = sessionMock;
    mockServer = server;
    getSpy = spyOn(mockServer, 'get').and.returnValue(Promise.resolve({ data: [] }));
    AdminPanelCtrl = $controller("AdminPanelCtrl", { $scope: scope, server: mockServer, $rootScope: rootScope });
  }));

  it('should load controller', function () {
    expect(AdminPanelCtrl).toBeDefined();
    expect(scope.defaultEmployeePhotoUrl).toBe("tzeqj4l6kjyq0jptankn");
  });

  it('should get all data on startup', function () {
    expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyId);
    expect(mockServer.get).toHaveBeenCalledWith('product/' + companyId);
    expect(mockServer.get).toHaveBeenCalledWith('admin/' + companyId);
  });

  describe('submit employee', function () {
    it('should create a new employee and reload', function (done) {
      mockServer.get.calls.reset();
      scope.employeeData = [];
      var spy = spyOn(mockServer, 'post').and
        .returnValue(Promise.resolve({ data: { photoUrl: 'aababab' } }));

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
          companyId: companyId
        }));

      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyId);
        expect(mockServer.get).not.toHaveBeenCalledWith('product/' + companyId);
        expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyId);
        done();
      });
    });

    it('should update employee image when it has been uploaded and reload', function (done) {
      mockServer.get.calls.reset();
      var spy = spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());

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

      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyId);
        expect(mockServer.get).not.toHaveBeenCalledWith('product/' + companyId);
        expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyId);
        done();
      });
    });

    it('should only update employee credit when no image has been uploaded and not reload', function (done) {
      mockServer.get.calls.reset();
      var spy = spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());

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


      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.get).not.toHaveBeenCalled();
        done();
      });
    });

    it('should remove employee and automatically remove it from the list and not reload', function (done) {
      var data = [{
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
      getSpy.calls.all().forEach(c => {
        c.returnValue.then(function () {
          // hack to make sure correct data is in place when original get is processed
          scope.employeeData = data;
        })
      });
      mockServer.get.calls.reset();

      spyOn(window, 'confirm').and.returnValue(true);
      var spy = spyOn(mockServer, 'delete').and.returnValue(Promise.resolve());

      scope.currentEmployee = data[1];

      scope.deleteEmployee();
      expect(mockServer.delete).toHaveBeenCalledOnceWith('/employee/id2');

      spy.calls.mostRecent().returnValue.then(function () {
        expect(scope.employeeData).toHaveSize(2);
        expect(scope.employeeData).not.toContain({
          id: "id2",
          name: "Halla2",
          nickname: "Holly2",
          credit: 5002
        });
        expect(mockServer.get).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('submit product', function () {
    it('should create a new product and reload', function (done) {
      mockServer.get.calls.reset();
      scope.productData = [];
      var spy = spyOn(mockServer, 'post').and
        .returnValue(Promise.resolve({ data: { photoUrl: 'aababab' } }));

      scope.currentProduct = {
        name: "Halla",
        category: "Holly",
        price: 5000
      };
      scope.submitProduct();

      expect(mockServer.post).toHaveBeenCalledOnceWith('/product',
        jasmine.objectContaining({
          name: "Halla",
          category: "Holly",
          price: 5000,
          companyId: companyId
        }));

      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.get).not.toHaveBeenCalledWith('employee/' + companyId);
        expect(mockServer.get).toHaveBeenCalledWith('product/' + companyId);
        expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyId);
        done();
      });
    });

    it('should update product image when it has been uploaded and reload', function (done) {
      mockServer.get.calls.reset();
      var spy = spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());

      scope.updating = true;
      scope.currentProduct = {
        id: 'id',
        name: "Halla",
        category: "Holly",
        price: 5000
      };
      scope.image = "animagebinaryrep";
      scope.submitProduct();
      expect(mockServer.patch).toHaveBeenCalledOnceWith('/product/' + companyId + '/id',
        jasmine.objectContaining({
          newPrice: 5000,
          photo: scope.image
        }));

      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.get).not.toHaveBeenCalledWith('employee/' + companyId);
        expect(mockServer.get).toHaveBeenCalledWith('product/' + companyId);
        expect(mockServer.get).not.toHaveBeenCalledWith('admin/' + companyId);
        done();
      });
    });

    it('should only update product price when no image has been uploaded and not reload', function (done) {
      mockServer.get.calls.reset();
      var spy = spyOn(mockServer, 'patch').and.returnValue(Promise.resolve())

      scope.updating = true;
      scope.currentProduct = {
        id: 'id',
        name: "Halla",
        category: "Holly",
        price: 5000
      };

      scope.submitProduct();
      expect(mockServer.patch).toHaveBeenCalledOnceWith('/product/price/' + companyId + '/id',
        jasmine.objectContaining({
          newPrice: 5000
        }));

      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.get).not.toHaveBeenCalled();
        done();
      });
    });

    it('should delete product and automatically remove it from the list and not reload', function (done) {
      var data = [{
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


      getSpy.calls.all().forEach(c => {
        c.returnValue.then(function () {
          // hack to make sure correct data is in place when original get is processed
          scope.productData = data;
        })
      });
      mockServer.get.calls.reset();

      var spy = spyOn(mockServer, 'delete').and.returnValue(Promise.resolve());
      spyOn(window, 'confirm').and.returnValue(true);

      scope.currentProduct = data[1];

      scope.deleteProduct();
      expect(mockServer.delete).toHaveBeenCalledOnceWith('/product/id2/' + companyId);

      spy.calls.mostRecent().returnValue.then(function () {
        expect(scope.productData).toHaveSize(2);
        expect(scope.productData).not.toContain({
          id: "id2",
          name: "Halla2",
          category: "Holly2",
          price: 5002
        });
        expect(mockServer.get).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('admin signup', function () {
    it('should not add admin if passwords do not match', function () {
      var newAdmin = {
        password: 'a',
        passwordConfirm: 'b'
      };

      spyOn(mockServer, 'post');
      scope.submitAdmin(newAdmin);

      expect(mockServer.post).not.toHaveBeenCalled();
      expect(scope.wrongpassword).toBeTrue();
    });

    it('should add new admin in two post requests', function (done) {
      var newAdmin = {
        password: 'a',
        passwordConfirm: 'a',
        name: 'Halla',
        username: 'holly'
      };

      mockServer.get.calls.reset();

      var firstCall = true;
      var spy = spyOn(mockServer, 'post').and.callFake(function (url, data) {
        if (firstCall) {
          firstCall = false;
          return Promise.resolve({ data: { adminRandomString: 'abcdef' } });
        }
        else {
          return Promise.resolve();
        }
      });
      scope.submitAdmin(newAdmin);

      expect(mockServer.post).toHaveBeenCalledWith('/login/requestAdminConnection',
        jasmine.objectContaining({
          adminPassHash: hashfunc(newAdmin.password)
        }));

      spy.calls.mostRecent().returnValue.then(function () {
        expect(mockServer.post).toHaveBeenCalledWith('/login/signupAdmin',
          jasmine.objectContaining({
            adminPassHash: hashfunc(hashfunc(newAdmin.password) + 'abcdef'),
            adminName: newAdmin.name,
            adminUser: newAdmin.username,
            companyId: companyId
          }));
        spy.calls.mostRecent().returnValue.then(function () {
          expect(mockServer.get).not.toHaveBeenCalled();
          expect(scope.adminData).toHaveSize(1);
          done();
        });
      });
    });
  });
});