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
  comments: {
    type: String
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  stock: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  produced: {
    type: Number
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date,
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
  },
  customerNumber: {
    type: Number
  },
  spec: {
    type: Object
  }
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = {Order};
