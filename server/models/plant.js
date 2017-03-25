var mongoose = require('mongoose');
var {Line} = require('./line');

var PlantSchema =  new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  numLines: {
    type: Number,
    required: true
  },
  lines: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

var Plant = mongoose.model('Plant', PlantSchema);

module.exports = {Plant};
