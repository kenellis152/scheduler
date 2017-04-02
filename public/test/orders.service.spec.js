describe('Orders Service', function () {
  var OrdersService;

  beforeEach(angular.mock.module('scheduler'));

  beforeEach(inject(function(_OrdersService_) {
    OrdersService = _OrdersService_;
    OrdersService.orders = orderseed;
  }));

  it('should exist', function () {
    expect(OrdersService).toBeDefined();
  });

  describe('service.changeOrder()', function () {

    it('should exist', function () {
      expect(OrdersService.changeOrder).toBeDefined();
    });

  });

  describe('retrieveOrder()', function () {
    it('should exist', function () {
      expect(OrdersService.retrieveOrder).toBeDefined();
    });

    it('should return -1 for an order that doesnt exist', function() {
      expect(OrdersService.retrieveOrder('567')).toBe(-1);
    });

    it('should return an order object for an order that does exist', function () {
      var order = OrdersService.retrieveOrder('58e05e4b8488c622d82eeea7');
      expect(order.part).toBe(155075);
    });
  });

  describe('storeOrder()', function () {
    it('should exist with 3 seed orders loaded', function () {
      expect(OrdersService.storeOrder).toBeDefined();
      expect(OrdersService.orders.length).toBe(3);
    })

    it('should store an order that doesnt already exist', function () {
      newOrder = {_id: '123', part: 155075};
      OrdersService.storeOrder(newOrder);
      expect(OrdersService.orders.length).toBe(4);
    });

    it('should replace an existing order', function () {
      newOrder = {_id: "123", part: 181069, quantity: 17000};
      console.log(OrdersService.orders[3]._id);
      OrdersService.storeOrder(newOrder);
      expect(OrdersService.orders.length).toBe(4);
      expect(OrdersService.orders[3].part).toBe(181069);
    });
  });

  describe('copyOrder()', function () {
    it('should exist', function () {
      expect(OrdersService.copyOrder).toBeDefined();
    });

    it('should copy an order param into another order', function () {
      var order1 = {_id: '1234', part: 155075, shipTo: 'River View', completed: false};
      var order2 = {_id: '1234', part: 181069, shipTo: 'Oaktown'};
      OrdersService.copyOrder(order1, order2); 
      expect(order1.part).toBe(181069);
      expect(order1.shipTo).toBe('Oaktown');
      expect(order1.completed).toBe(false);
    });
  });

});
