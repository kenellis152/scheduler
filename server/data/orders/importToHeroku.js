require('./../../config/config');
var history = require('./chemicalHistory.json');
var {Order} = require('./../../models/order');
var moment = require('moment');
var _ = require('lodash');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_l3p3wsld:v6l6nnhsv5sqpak01o9fja97ma@ds035856.mlab.com:35856/heroku_l3p3wsld');

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
  order = _.pick(order, ['part, quantity', 'coNumber', 'shipTo', 'plant', 'completed', 'customerNumber', 'createDate'])
}

Order.remove({}).then( () => {
  Order.insertMany(history).then( (result) => {
    if(!result) {
      console.log("failure1");
    }
    console.log('success');
  });
}).catch( (e) => {
  console.log(e);
});
