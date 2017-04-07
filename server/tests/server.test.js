const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Order} = require('./../models/order');
const {Line} = require('./../models/line');
const {Plant} = require('./../models/plant');
const {orders, populateOrders, resinSpecs, populateSpecs} = require('./seed/seed');

beforeEach(populateOrders);
beforeEach(populateSpecs);

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

// Get open order ids
describe('GET /orders/id -- open order ids', () => {
  it('should fetch all open order ids', (done) => {
    var expectedResponse = [orders[0]._id.toHexString(), orders[1]._id.toHexString()];
    request(app)
      .get('/orders/open/id')
      .send()
      .expect(200)
      .expect( (res) => {
        expect(res.body.length).toBe(2);
        expect(res.body).toEqual(expectedResponse);
      })
      .end(done);
  });
});

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

  it('should return a 404 if order not found', (done) => {
    var testId = new ObjectID();
    request(app)
      .get(`/orders/${testId}`)
      .send()
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
    request(app)
      .get(`/orders/12345`)
      .send()
      .expect(404)
      .end(done);
  });
});
// End get order by id

// Update order by id
describe('PATCH orders/:id', (done) => {
  it('should update the order', (done) => {
    var hexId = orders[0]._id.toHexString();
    var body = {completed: true, comments: "this order sucks"};
    request(app)
      .patch(`/orders/${hexId}`)
      .send(body)
      .expect(200)
      .expect( (res) => {
        expect(res.body.order.comments).toBe(body.comments);
        expect(res.body.order.completed).toBe(body.completed);
      })
      .end(done);
  });
});
// End update order by id

// Get orders x days back
describe('GET orders/daysback/:days', (done) => {
  it('should fetch 2 orders that have due date greater than or equal to 5 days back', (done) => {
    request(app)
      .get('/orders/daysback/5')
      .send()
      .expect(200)
      .expect( (res) => {
        // console.log('daysback', res.body);
        expect(res.body.orders.length).toBe(2);
        expect(res.body.orders[0].part).toBe(157193);
      })
      .end(done);
  });

  it('should return a 404 if no orders found', (done) => {
    request(app)
      .get('/orders/daysback/0')
      .send()
      .expect(404)
      .end(done);
  });
});

// Delete Order
describe('DELETE /orders/:id', (done) => {
  it('should return 404 if id not found', (done) => {
    request(app)
      .delete('/orders/5')
      .send()
      .expect(404)
      .end(done);
  });

  it('should return the deleted object', (done) => {
    request(app)
      .delete(`/orders/${orders[0]._id}`)
      .send()
      .expect(200)
      .expect( (res) => {
        expect(res.body.order.comments).toEqual("whatever");
      })
      .end(done);
  });

  it('should remove the object from the database', (done) => {
    var hexId = orders[0]._id.toHexString();
    request(app)
      .delete(`/orders/${hexId}`)
      .send()
      .expect(200)
      .expect( (res) => {
        expect(res.body.order._id).toBe(hexId);
      })
      .end( (err, res) => {
        if (err) {
          return done(err);
        }
        Order.findById(orders[0]._id).then( (order) =>{
          expect(order).toNotExist();
          done();
        }).catch( (e) => done(e));
      });
  });
});
//End Delete order

//*****************************
//       ResinSpec API
//*****************************

// Adds an array of objects -- Object.specs where "specs" is the array. Adds them all to resinspecs collection
// app.post('/resinspecs', (req, res) => {
describe('POST /resinspecs -- add array of objects', (done) => {
  it('should add an array of objects', (done) => {
    var testArray = resinSpecs;
    testArray[0]._id = new ObjectID();
    testArray[1]._id = new ObjectID();
    request(app)
      .post('/resinspecs')
      .send(testArray)
      .expect(200)
      .expect( (res) => {
        expect(res.text).toBe('success');
      })
      .end(done);
  });
});

// ** Get spec by part #
// Take a part number and return the resin specs
// app.get('/resinspecs/:pn', (req, res) => {
describe('GET /resinspecs/:pn', (done) => {
  it('should return resin spec for PN 132030', (done) => {
    request(app)
      .get(`/resinspecs/132030`)
      .expect(200)
      .expect( (res) => {
        expect(res.body.spec.description).toBe(resinSpecs[0].description);
      })
      .end(done);
  });

  it('should return 404 if part number not found', (done) => {
    request(app)
      .get(`/resinspecs/123456`)
      .expect(404)
      .end(done);
  });

});

//*****************************
//        Line API
//*****************************

// Save new line
// app.post('/lines', (req, res) => {
// describe('POST /lines -- add new line', (done) => {
//   it('should save a new line', (done) => {
//
//   });
// });
//
// // Get all lines
// // app.get('/lines/all', (req, res) => {
// describe('GET /lines/all', (done) => {
//   it('should get all lines', (done) => {
//
//   });
// });
