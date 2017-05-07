var mongoose = require('mongoose');

var ProductionSchema =  new mongoose.Schema({
  part: { // part number
    type: Number,
    required: true,
    minlength: 1,
  },
  productionType: { // either "production" or "adjustment" which will simply set the current inventory level
    type: String,
    required: true
  },
  quantity: { // quantity received
    type: Number,
    required: true
  },
  plant: { // plant received/adjusted at
    type: Number,
    required: true,
    default: 1
  },
  date: { // date of receipt or adjustment
    type: Date,
    default: new Date()
  },
  reason: {
    type: String,
    default: "None given"
  }
});

var Production = mongoose.model('Production', ProductionSchema);

module.exports = {Production};
