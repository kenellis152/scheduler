var mongoose = require('mongoose');

var OrderSchema =  new mongoose.Schema({
  part: {
    type: Number,
    required: true,
    minlength: 1,
  },
  quantity: {
    type: Number,
    required: true,
    minlength: 1
  },
  plant: {
    type: Number,
    default: 1
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: Date.now
    // required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date,
    default: Date.now
  },
  customerId: {
    type: Number
  },
  shipTo: {
    type: String
  },
  cancelled: {
    type: Boolean
  },
  cancelledReason: {
    type: String
  },
  coNumber: {
    type: Number
  }
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = {Order};
