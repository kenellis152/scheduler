const {ObjectID} = require('mongodb');
const {Order} = require('./../../models/order');
// const {Line} = require('./../../models/line');
// const {Plant} = require('./../../models/plant');
const jwt = require('jsonwebtoken');

const orderOneId = new ObjectID();
const orderTwoId = new ObjectID();
const orderThreeId = new ObjectID();

const orders = [{
  _id: orderOneId,
  part: 157193,
  quantity: 18000,
  plant: 1,
  coNumber: 473473
  },
  {
  _id: orderTwoId,
  part: 181069,
  quantity: 17000,
  plant: 1,
  coNumber: 473474
  },
  {
  _id: orderThreeId,
  part: 155075,
  quantity: 20160,
  plant: 1,
  coNumber: 473475,
  completed: true
}];

const populateOrders = (done) => {
  Order.remove({}).then( () => {
    Order.insertMany(orders);
  }).then( () => done() ).catch((e) => {
    // console.log("error: " + e);
    done();
  });
};

module.exports = {
  orders,
  populateOrders
};
