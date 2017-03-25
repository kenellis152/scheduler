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
var {Spec} = require('./models/spec');
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
    dueDate: req.body.date,
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

// Update order by id
app.patch('/orders/:id', (req, res) => {
  var {id} = req.params;
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  var body = _.pick(req.body, ['part', 'quantity', 'plant', 'createDate', 'dueDate', 'completed',
                                'completedDate', 'customerId', 'shipTo', 'cancelled', 'cancelledReason', 'coNumber']);
  Order.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then( (order) => {
    if(!order) {
      return res.status(404).send();
    }
    res.send({order});
  }).catch( (e) => {
    res.status(400).send();
  });

});
// End update order by id

// Delete Order

//End Delete order

//*****************************
//       ResinSpec API
//*****************************

// Takes an object, with an array of "Spec" objects on the "specs" property. Adds them all to resinspecs collection
app.post('/resinspecs', (req, res) => {
  Spec.insertMany(req.body.specs).then( (result) => {
    if(!result) {
      return res.status(404).send();
    }
    res.send('success');
  }).catch( (e) => {
    res.status(400).send(e);
  });
});// End post resinspec array

// Take a part number and return the resin specs
app.get('/resinspecs/:pn', (req, res) => {
  var {pn} = req.params;
  Spec.findOne({part: pn}).then( (spec) => {
    if (!spec) {
      res.status(404).send();
    }
    res.send({spec});
  }).catch((err) => {
    res.status(400).send();
  });
});// End get resin spec by part number



// Get specs by part # -- take an array of part #'s and return an array of resin specs


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
