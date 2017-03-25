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
var {Plant} = require('./models/plant');
var {Line} = require('./models/line');
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
    coNumber: req.body.coNumber,
    plant: req.body.plant
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
  var {plant} = req.query;
  // console.log(req);
  console.log(plant);
  if (plant) {
    Order.find({'completed': false, 'plant': plant}).then( (openOrders) => {
      res.send(openOrders);
    }).catch( (err) => {
      res.status(400).send();
    });
  } else {
    Order.find({'completed': false}).then( (openOrders) => {
      res.send(openOrders);
    }).catch( (err) => {
      res.status(400).send();
    });
  }
});
// End get open orders

// Get open order ids
// If body contains a plant id, return only orders for that plant
// Else return all open order ids
app.get('/orders/open/id', (req, res) => {
  var {plant} = req.query;
  if(plant) {
    Order.find({'completed': false, 'plant': 1}).then( (openOrders) => {
      var result = [];
      openOrders.forEach( (element)=> {
        result.push(element._id);
      });
      res.send(result);
    }).catch( (err) => {
      res.status(400).send();
    });
  } else {
    Order.find({'completed': false}).then( (openOrders) => {
      var result = [];
      openOrders.forEach( (element)=> {
        result.push(element._id);
      });
      res.send(result);
    }).catch( (err) => {
      res.status(400).send();
    });
  }
});
// End get open order ids

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
// *** TO DO ***
//End Delete order

//*****************************
//       ResinSpec API
//*****************************

// ** Resin Spec mass adder
// Adds an array of objects -- Object.specs where "specs" is the array. Adds them all to resinspecs collection
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

// ** Get spec by part #
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


//*****************************
//       Plant API
//*****************************

// Save new plant
app.post('/plants', (req, res) => {
  var plant = new Plant({
    name: req.body.name,
    id: req.body.id,
    numLines: req.body.numLines,
    lines: req.body.lines
  });
  plant.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});
//End Save new plant

// Get plant by id
app.get('/plants/:id', (req, res) => {
  var {id} = req.params;
  Plant.findOne({id: id}).then( (plant) => {
    if (!plant) {
      res.status(404).send();
    }
    res.send({plant});
  }).catch((err) => {
    res.status(400).send(err);
  });
});
// End Get plant by id

//*****************************
//       Line API
//*****************************

// Save new line
app.post('/lines', (req, res) => {
  var line = new Line({
    plant: req.body.plant,
    activeShifts: req.body.activeShifts,
    largeDiam: req.body.largeDiam,
    tooSpeedie: req.body.tooSpeedie,
    orders: req.body.orders
  });
  line.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});
//End Save new line

// Get all lines
app.get('/lines/all', (req, res) => {
  Line.find().then( (allLines) => {
    res.send(allLines);
  }).catch( (err) => {
    res.status(404).send();
  });
});
// End get all lines

// Get lines by plant id
app.get('/lines/:id', (req, res) => {
  var {id} = req.params;
  Line.find({plant: id}).then( (lines) => {
    if (!lines) {
      res.status(404).send();
    }
    res.send({lines});
  }).catch((err) => {
    res.status(400).send(err);
  });
});
// End Get lines by plant id

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
