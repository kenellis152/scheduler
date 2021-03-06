require('./../../config/config');
var history = require('./chemicalHistory.json');
var {Order} = require('./../../models/order');
var moment = require('moment');
var _ = require('lodash');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

var newOrders = [];

for (let order of history) {
  //convert Excel date to javascript date
  order.dueDate = new Date((order.dueDate - (25567 + 1))*86400*1000);
  if( order.dueDate < new Date() ) {
    order.completed = true;
  } else {
    order.completed = false;
  }
  order.coNumber = order.coNumber.substr(3);
  order.createDate = new moment(order.createDate).toDate();
  order = _.pick(order, ['part', 'quantity', 'coNumber', 'shipTo', 'plant', 'completed', 'customerNumber', 'createDate', 'dueDate']);
  if (order.part >= 100000 && order.part <= 999999) {
    newOrders.push(order);
  }
}

Order.remove({}).then( () => {
  Order.insertMany(newOrders).then( (result) => {
    if(!result) {
      console.log("failure1");
    }
    console.log('success');
  });
}).catch( (e) => {
  console.log(e);
});
