var mongoose = require('mongoose');

var LineSchema =  new mongoose.Schema({
  plant: {
    type: Number,
    required: true
  },
  activeShifts: {
    type: Number,
    default: 1
  },
  name: {
    type: String
  },
  largeDiam: {
    type: Boolean,
    default: false
  },
  tooSpeedie: {
    type: Boolean,
    default: false
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

var Line = mongoose.model('Line', LineSchema);

module.exports = {Line};
