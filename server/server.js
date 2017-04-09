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
var {User} = require('./models/user');
var cors = require('cors');
var moment = require('moment');
var {authenticate} = require('./middleware/authenticate');

//*****************************
//   TO DO
//*****************************
// Delete expired tokens on user login
// Tests for Plant and Line API's

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
// tests: done
app.post('/orders', (req, res) => {
  var order = new Order({
    part: req.body.part,
    quantity: req.body.quantity,
    dueDate: req.body.date,
    coNumber: req.body.coNumber,
    plant: req.body.plant,
    shipTo: req.body.shipTo,
    comments: req.body.comments,
    createDate: req.body.createDate,
    stock: req.body.stock
  });
  order.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});
//End Save new order

// Get open orders
// tests: done
app.get('/orders/open', (req, res) => {
  var {plant} = req.query;
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
// tests: done
app.get('/orders/open/id', (req, res) => {
  var {plant} = req.query;
  if(plant) {
    Order.find({'completed': false, 'plant': plant}).then( (openOrders) => {
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
// tests: done
app.patch('/orders/:id', (req, res) => {
  var {id} = req.params;
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  var body = _.pick(req.body, ['part', 'quantity', 'plant', 'createDate', 'dueDate', 'completed', 'comments', 'produced',
                                'completedDate', 'customerId', 'shipTo', 'cancelled', 'cancelledReason', 'coNumber', 'stock']);
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
// takes order id, returns deleted object
// tests: done
app.delete('/orders/:id', (req, res) => {
  var {id} = req.params;
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  Order.findOneAndRemove({_id: id}).then( (order) => {
    if (!order) {
      res.status(404).send();
    }
    res.send({order});
  }).catch( (err) => {
    res.status(404).send();
  });
});// End Delete order

// Get all orders starting from ":days" number of days back
// tests: done
app.get('/orders/daysback/:days', (req, res) => {
  var {days} = req.params;
  var startDate = moment().subtract(days, "days").toDate();
  Order.find({dueDate: {"$gte": startDate}}).then( (orders) => {
    if (orders.length === 0) {
      res.status(404).send();
    }
    res.send({orders});
  }).catch((err) => {
    res.status(400).send();
  });
});
// End Get order by id

//*****************************
//       ResinSpec API
//*****************************

// ** Resin Spec mass adder
// Adds an array of objects -- Object.specs where "specs" is the array. Adds them all to resinspecs collection
// tests: done
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
// tests: done
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

// ** Get spec array by part # array
// Take an array of part numbers, return array of specs for the part numbers
// app.post('/resinspecs/partarray', (req, res) => {
//   var parts = req.body;
//   // console.log(req.body);
//   var result = [];
//   parts.forEach( (part) => {
//     Spec.findOne({part}).then( (spec) => {
//       if (!spec) {
//         res.status(404).send();
//       }
//       console.log(spec.description)
//       result.push(spec);
//     }).catch((err) => {
//       res.status(400).send();
//     });
//   })
//   console.log(result.length);
//   res.send(result);
// });// End get resin spec by part number


//*****************************
//       Plant API
//*****************************

// Save new plant
// tests: NOT DONE
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
// tests: NOT DONE
app.get('/plants/:id', (req, res) => {
  var {id} = req.params;
  // console.log(req.header('x-schedulerauth'));
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
// tests: NOT DONE
app.post('/lines', (req, res) => {
  var line = new Line({
    plant: req.body.plant,
    activeShifts: req.body.activeShifts,
    largeDiam: req.body.largeDiam,
    tooSpeedie: req.body.tooSpeedie,
    orders: req.body.orders,
    name: req.body.name
  });
  line.save().then( (doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});
//End Save new line

// Get all lines
// tests: NOT DONE
app.get('/lines/all', (req, res) => {
  Line.find().then( (allLines) => {
    res.send(allLines);
  }).catch( (err) => {
    res.status(404).send();
  });
});
// End get all lines

// Get lines by plant id
// tests: NOT DONE
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


// Update Line
// id param denotes the line to Update
// tests: NOT DONE
app.patch('/lines/:id', (req, res) => {
  var {id} = req.params;
  var body = _.pick(req.body, ['activeShifts', 'name', 'largeDiam', 'tooSpeedie', 'orders']);
  // console.log(body);
  Line.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then( (line) => {
    if (!line) {
      res.status(404).send();
    }
    res.send({line});
  }).catch((err) => {
    res.status(400).send(err);
  });
});
// End Get lines by plant id

//*****************************
//       User API
//*****************************
// POST /users
// tests: done
app.post('/users/', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then( () => {
    return user.generateAuthToken();
  }).then( (token) => {
    res.header('x-schedulerauth', token).send(user);
  }).catch( (e) => {
    res.status(400).send(e);
  })
});

// Get user corresponding to token passed in via header
// tests: done
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// User login request. Return user info and x-schedulerauth token if successful. Return 400 status if not successful
// test: done
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then( (user) => {
    user.generateAuthToken().then( (token) => {
      res.header('x-schedulerauth', token).send(user);
    });
  }).catch( (e) => {
    res.status(400).send();
  });
});

// delete a token
// note that the authenticate middleware is attaching the user and token properties to the request, corresponding to the User document and authentication token
// tests: NOT DONE
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then( () => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

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
