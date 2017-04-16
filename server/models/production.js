var mongoose = require('mongoose');

var ProductionSchema =  new mongoose.Schema({
  part: {
    type: Number,
    required: true,
    minlength: 1,
  },
  productionType: {
    type: String,
    required: true
  }
  quantity: {
    type: Number,
    required: true
  },
  plant: {
    type: Number,
    required: true,
    default: 1
  },
  date: {
    type: Date
  }
});

var Production = mongoose.model('Production', ProductionSchema);

module.exports = {Production};
