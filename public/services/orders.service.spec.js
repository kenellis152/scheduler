describe('Orders Service', function () {
  var OrdersService;

  beforeEach(angular.mock.module('scheduler'));

  beforeEach(inject(function(_OrdersService_) {
    OrdersService = _OrdersService_;
  }));

  it('has a dummy spec to test 2 + 2', function () {
    expect(2 + 2).toEqual(4);
  }); 
});
