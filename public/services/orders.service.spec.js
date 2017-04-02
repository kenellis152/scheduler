require('./testseed')

describe('Orders Service', function () {
  var OrdersService;

  beforeEach(angular.mock.module('scheduler'));

  beforeEach(inject(function(_OrdersService_) {
    OrdersService = _OrdersService_;
  }));

  it('should exist', function () {
    expect(OrdersService).toBeDefined();
  });

  describe('service.changeOrder()', function () {

    it('should exist', function () {
      expect(OrdersService.changeOrder).toBeDefined();
    });

  });

  describe('storeOrder()', function() {


    it('should exist', function () {
      expect(OrdersService.storeOrder).toBeDefined();
    })

    it('should store an order that doesnt already exist', function () {

    });

    it('should replace an existing order', function () {

    });

  });

});
