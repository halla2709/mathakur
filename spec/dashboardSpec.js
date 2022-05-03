describe('Main workflow Controller', function () {
  const companyName = "TestingComp";
  var DashboardCtrl, scope, mockServer, rootScope;
  var getSpy;
  var sessionMock = {
    getSchool: function () { return companyName; },
    getLevel: function () { return 1; },
    isBelowZeroAllowed: function () { return false; }
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
    expect(mockServer.get).toHaveBeenCalledWith('employee/' + companyName);
    expect(mockServer.get).toHaveBeenCalledWith('food/' + companyName);
  });
});