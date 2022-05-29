describe('Main workflow Controller', function () {
  const companyId = "abcd-1234-7894-6549-efgd";
  var DashboardCtrl, scope, mockServer, rootScope;
  var sessionMock = {
    getCompanyId: function () { return companyId; },
    getLevel: function () { return 0; },
    isBelowZeroAllowed: function () { return false; },
    isLoggedIn: function () { return true; },
    load: function() {
      return { then: function(cb) {
        cb();
      }};
    }
  }

  beforeEach(module('mathakur'));

  beforeEach(inject(function ($controller, $rootScope, server) {
    scope = $rootScope.$new();
    rootScope = scope;
    rootScope.session = sessionMock;
    mockServer = server;
    getSpy = spyOn(mockServer, 'get').and.returnValue(Promise.resolve({ data: [] }));
    DashboardCtrl = $controller("DashboardCtrl", { $scope: scope, server: mockServer, $rootScope: rootScope });
  }));

  it('should load controller', function () {
    expect(DashboardCtrl).toBeDefined();
    expect(scope.receipt).toEqual([]);
  });

  it('should get all data on startup', function () {
    expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyId);
    expect(mockServer.get).toHaveBeenCalledWith('product/' + companyId);
  });

  it('can add up the order', function() {
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.creditAfter = scope.employee.credit;
    expect(scope.total).toBe(0);
    expect(scope.creditAfter).toBe(1000);

    scope.addProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(10);
    expect(scope.creditAfter).toBe(990);

    scope.addProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(20);
    expect(scope.creditAfter).toBe(980);

    scope.addProduct({ price: 100, name: 'product2' });
    expect(scope.total).toBe(120);
    expect(scope.creditAfter).toBe(880);
  });

  it('can remove from the order', function() {
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.creditAfter = scope.employee.credit;
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    scope.removeProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(110);
    expect(scope.creditAfter).toBe(890);

    scope.removeProduct({ price: 100, name: 'product2' });
    expect(scope.total).toBe(10);
    expect(scope.creditAfter).toBe(990);

    scope.removeProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(0);
    expect(scope.creditAfter).toBe(1000);
  });

  it('can clear the order', function() {
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.creditAfter = scope.employee.credit;
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    scope.removeAllProduct();
    expect(scope.total).toBe(0);
    expect(scope.creditAfter).toBe(1000);
  });

  it('can complete the order with enough credit', function() {
    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.creditAfter = scope.employee.credit;
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    spyOn(window, 'confirm').and.returnValue(true);
    scope.buyProduct();
    expect(mockServer.patch).toHaveBeenCalledOnceWith('employee/updatecredit/11111', jasmine.objectContaining({
      newCredit: 880
    }));
    expect(scope.employee).toBeNull();
    expect(scope.total).toBe(0);
    expect(scope.creditAfter).toBe(0);
  });

  it('will block the order without enough credit', function() {
    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.employee = { 
      credit: 10,
      id: 11111
    };
    scope.creditAfter = scope.employee.credit;
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    spyOn(window, 'confirm').and.returnValue(true);
    scope.buyProduct();
    expect(window.confirm).not.toHaveBeenCalled();
    expect(mockServer.patch).not.toHaveBeenCalled();
    expect(scope.employee).not.toBeNull();
    expect(scope.total).not.toBe(0);
    expect(scope.creditAfter).not.toBe(0);
    expect(scope.notEnoughCredit).toBeTrue();
  });

  it('will allow the order without enough credit when configured that way', function() {
    sessionMock.isBelowZeroAllowed = function () { return true; }
    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.employee = { 
      credit: 10,
      id: 11111
    };
    scope.creditAfter = scope.employee.credit;
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    spyOn(window, 'confirm').and.returnValue(true);
    scope.buyProduct();
    expect(mockServer.patch).toHaveBeenCalledOnceWith('employee/updatecredit/11111', jasmine.objectContaining({
      newCredit: -110
    }));
    expect(scope.employee).toBeNull();
    expect(scope.total).toBe(0);
    expect(scope.creditAfter).toBe(0);
  });
});