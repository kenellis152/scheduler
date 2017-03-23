//*****************************
//   Server Config
//*****************************
require('./config/config');

//*****************************
//   Dependencies
//*****************************
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
var {Order} = require('./models/order');
// var {Plant} = require('./models/plant');
// var {Line} = require('./models/line');
var cors = require('cors');

//*****************************
//   Set up the server app
//*****************************
var app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());


//*****************************
//        Orders API
//*****************************

// Save new order
app.post('/orders', (req, res) => {
  var order = new Order({
    part: req.body.part,
    quantity: req.body.quantity,
    // dueDate: req.body.dueDate,
    coNumber: req.body.coNumber
  });
  order.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});
//End Save new order

// Get open orders
app.get('/orders/open', (req, res) => {
  Order.find({'completed': false}).then( (openOrders) => {
    res.send(openOrders);
  }).catch( (err) => {
    res.status(404).send();
  });
});
// End get open orders

// Get order by id
app.get('/orders/:id', (req, res) => {
  var {id} = req.params;
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  Order.findOne({_id: id}).then( (order) => {
    if (!order) {
      res.status(404).send();
    }
    res.send({order});
  }).catch((err) => {
    res.status(400).send();
  });
});
// End Get order by id

// ****** Work in Progress ******
// Update order by id
app.patch('/orders/:id', (req, res) => {
  var {id} = req.params;
  var body = _.pick(req.body, ['']);

  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }


});
// End update order by id

// Delete Order

//End Delete order

//*****************************
//   Frontend public path
//*****************************
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

//*****************************
//      Start the Server
//*****************************
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
