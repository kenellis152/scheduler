const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Order} = require('./../models/order');
// const {Line} = require('./../models/line');
// const {Plant} = require('./../models/plant');
const {orders, populateOrders} = require('./seed/seed');

beforeEach(populateOrders);

//*****************************
//        Orders API
//*****************************

// Save new order
describe('POST /orders --- Save new order', () => {
  it('should create a new order', (done) => {
    var newOrder = {"part": 244033,	"quantity": 45000, "coNumber": 555555};

    request(app)
      .post('/orders')
      .send(newOrder)
      .expect(200)
      .expect( (res) => {
        expect(res.body.part).toBe(newOrder.part);
      })
      .end( (err, res) => {
        if(err) {
          console.log(res);
          return done(err);
        }
        Order.find({"part": 244033}).then( (result) => {
          expect(result.length).toBe(1);
          done();
        }).catch( (e) => done(e));
      });

  });
});
// End save new order

// Get open orders
describe('GET /orders/open', () => {

  it('should fetch all open orders', (done) => {
    request(app)
      .get('/orders/open')
      .send()
      .expect(200)
      .expect( (res) => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  });
});
// End get open orders

// Get order by id
describe('GET /orders/:id', () => {

  it('should return order item', (done) => {
    request(app)
      .get(`/orders/${orders[0]._id.toHexString()}`)
      .send()
      .expect(200)
      .expect( (res) => {
        expect(res.body.order.part).toBe(orders[0].part);
      })
      .end(done);
  });

  // it('should return a 404 if order not found', (done) => {
  //
  // });
  //
  // it('should return a 404 for non-object ids', (done) => {
  //
  // });

});
// End get order by id

// Update order by id
describe('PATCH orders/:id', (done) => {

});
// End update order by id
