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
    expect(mockServer.get).toHaveBeenCalledWith('employee/all/' + companyId);
    expect(mockServer.get).toHaveBeenCalledWith('product/' + companyId);
  });

  it('can add up the order', function() {
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    expect(scope.total).toBe(0);

    scope.addProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(10);

    scope.addProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(20);

    scope.addProduct({ price: 100, name: 'product2' });
    expect(scope.total).toBe(120);
  });

  it('can remove from the order', function() {
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    scope.removeProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(110);

    scope.removeProduct({ price: 100, name: 'product2' });
    expect(scope.total).toBe(10);

    scope.removeProduct({ price: 10, name: 'product1' });
    expect(scope.total).toBe(0);
  });

  it('can clear the order', function() {
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    scope.removeAllProduct();
    expect(scope.total).toBe(0);
  });

  it('can complete the order with enough credit', function() {
    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.employee = { 
      credit: 1000,
      id: 11111
    };
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    scope.buyProduct();
    expect(mockServer.patch).toHaveBeenCalledOnceWith('employee/updatecredit/11111', jasmine.objectContaining({
      transaction: 120
    }));
  });

  it('will not add more to basket without enough credit', function() {
    scope.employee = { 
      credit: 10,
      id: 11111
    };
    scope.addProduct({ price: 10, name: 'product1' });
    expect(scope.showErrorMessage).toBeFalse();
    scope.addProduct({ price: 10, name: 'product1' });
    expect(scope.showErrorMessage).toBeTrue();
    scope.addProduct({ price: 100, name: 'product2' });
    expect(scope.showErrorMessage).toBeTrue();
    expect(scope.employee).not.toBeNull();
    expect(scope.total).not.toBe(0);

    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.buyProduct();
    expect(mockServer.patch).toHaveBeenCalledOnceWith('employee/updatecredit/11111', jasmine.objectContaining({
      transaction: 10
    }));
  });

  it('will allow the order without enough credit when configured that way', function() {
    sessionMock.isBelowZeroAllowed = function () { return true; }
    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.employee = { 
      credit: 10,
      id: 11111
    };
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 10, name: 'product1' });
    scope.addProduct({ price: 100, name: 'product2' });

    scope.buyProduct();
    expect(mockServer.patch).toHaveBeenCalledOnceWith('employee/updatecredit/11111', jasmine.objectContaining({
      transaction: 120
    }));
    sessionMock.isBelowZeroAllowed = function () { return false; }
  });

  it('updates employee information when starting to select product', function() {
    mockServer.get.calls.reset();
    const employeeId = 'aaa.aaa';
    const selectedEmployee = { id: employeeId };
    scope.selectStaff(selectedEmployee);
    expect(mockServer.get).toHaveBeenCalledWith('employee/' + employeeId);
  });

  it('can revert the last transaction', function() {
    scope.employee = { 
      credit: 100,
      id: 11111
    };
    scope.addProduct({ price: 10, name: 'product1' });
    scope.buyProduct();

    spyOn(mockServer, 'patch').and.returnValue(Promise.resolve());
    scope.undoLastTransaction();
    expect(mockServer.patch).toHaveBeenCalledOnceWith('employee/updatecredit/11111', jasmine.objectContaining({
      transaction: -10
    }));
  });
});