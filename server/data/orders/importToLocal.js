require('./../../config/config');
var history = require('./chemicalHistory.json');
var {Order} = require('./../../models/order');
var moment = require('moment');
var _ = require('lodash');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

for (let order of history) {
  //convert Excel date to javascript date
  order.dueDate = new Date((order.dueDate - (25567 + 1))*86400*1000);
  order.coNumber = order.coNumber.substr(3);
  order.createDate = new moment(order.createDate).toDate();
  order = _.pick(order, ['part, quantity', 'coNumber', 'shipTo', 'plant', 'completed', 'customerNumber', 'createDate'])
}

Order.insertMany(history).then( (result) => {
  if(!result) {
    console.log("failure1");
  }
  console.log('success');
}).catch( (e) => {
  console.log(e);
});


// var mi = require('mongoimport');
// var resindata = require('./packagingChart.json');
//
// var config = {
//   fields: resindata,
//   db: 'SchedulerApp',
//   collection: 'resinSpecs',
//   host:'localhost:27017',
//   callback: (err, db) => {
//     if(err){
//       consolog.log(err);
//     } else {
//       console.log('success');
//     }
//   }
// }
//
// mi(config);
