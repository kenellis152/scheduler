require('./../../config/config');
var {Order} = require('./../../models/order');
var {Line} = require('./../../models/line');
var moment = require('moment');
var _ = require('lodash');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_l3p3wsld:v6l6nnhsv5sqpak01o9fja97ma@ds035856.mlab.com:35856/heroku_l3p3wsld');

Order.remove({}).catch( (e) => {
  console.log('failed to remove orders', e);
});

Line.updateMany({}, {orders: []}).then( (results) => {
  console.log('success');
}).catch( (e) => {
  console.log('failed to update lines', e);
})
