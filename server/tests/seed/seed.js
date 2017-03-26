const {ObjectID} = require('mongodb');
const {Order} = require('./../../models/order');
const {Line} = require('./../../models/line');
const {Plant} = require('./../../models/plant');
const {Spec} = require('./../../models/spec')
const jwt = require('jsonwebtoken');

const orderOneId = new ObjectID();
const orderTwoId = new ObjectID();
const orderThreeId = new ObjectID();
const resinOneId = new ObjectID();
const resinTwoId = new ObjectID();

const orders = [{
  _id: orderOneId,
  part: 157193,
  quantity: 18000,
  plant: 1,
  coNumber: 473473,
  comments: "whatever"
  },
  {
  _id: orderTwoId,
  part: 181069,
  quantity: 17000,
  plant: 1,
  coNumber: 473474
  },
  {
  _id: orderThreeId,
  part: 155075,
  quantity: 20160,
  plant: 1,
  coNumber: 473475,
  completed: true
}];



const populateOrders = (done) => {
  Order.remove({}).then( () => {
    Order.insertMany(orders);
  }).then( () => done() ).catch((e) => {
    // console.log("error: " + e);
    done();
  });
};

const populateSpecs = (done) => {
  Spec.remove({}).then( () => {
    Spec.insertMany(resinSpecs);
  }).then( () => done() ).catch( (e) => {
    done();
  });
};

const resinSpecs = [{
    _id : resinOneId,
    __v : 0,
    plant : "B or G",
    part : 132030,
    description : "A23 2' LIF20 (2PB, 50 Bxs) ",
    clip : "None",
    boxSw : "B",
    piecesPerBundle : 50,
    bundleWeight : 45.81,
    numBoxes : 50,
    palletCount : 2500,
    packagingCode : 12221,
    speed : "20",
    gelSpeed : "20",
    viscosity : "LIF",
    formulation : "LIF20",
    masticPartNumber : "70415",
    catalystPartNumber : "72036",
    cartridgeLength : 17,
    holeDiameter : 1,
    mmCartridgeDiameter : 23,
    inCartridgeDiameter : 0.8956692852835,
    groutVolume : 10.7110932135595,
    labelColor : "Orange",
    expiration : "12 months (+/- 1 day) from date of manufacture",
    cartSpeed : "x-Fast",
    cartDiam : 23,
    speedIndex : "15",
    mixSpeed : 600,
    minLength : 17,
    stadardLength : 17.25,
    standardLinearDensity : 0.0479,
    standardWeightLbs : 0.826275,
    standardWeightGrams : 375.12885,
    masticPN : "LIF20",
    masticWeightLbs : 0.5783925,
    pastePN : "72036",
    pastWeightLbs : 0.2478825,
    clips : "12-8 4x1.25 Universal Clip",
    clipPN : "8509",
    innerFilm : "40mm142 gauge",
    innerFilmLength : 1.54166666666667,
    innerFilmPN : 8030,
    outerFilm : "84mm200 gauge",
    outerFilmLength : 1.54166666666667,
    outerfilmPN : 8032,
    boxDescription : "22\"-2pc",
    boxTopPN : "8425",
    boxBottomPN : "8426",
    boxWeight : 1.8,
    boxStraps : 2,
    shrinkWrapPN : "NA",
    shrinkWrapWeightGrams : 6.77307773867909,
    shrinkWrapWeightLbs : 0,
    volume : 547.389765484648,
    filmLength : 12.2,
    filmLengthWithAngle : 14.6223612665784,
    extraClipPN : "NA",
    xaShippingWeight : 0.9362,
    palletSize : "48 x 44",
    palletWeight : 2340.5
},
{
    _id : resinTwoId,
    __v : 0,
    plant : "B or G",
    part : 141077,
    description : "A23 3.5' M45LIF (2PB, 36 Bxs)",
    clip : "None",
    boxSw : "B",
    piecesPerBundle : 40,
    bundleWeight : 60.451,
    numBoxes : 36,
    palletCount : 1440,
    packagingCode : 12315,
    speed : "45",
    gelSpeed : "45",
    viscosity : "M",
    formulation : "M45",
    masticPartNumber : "70316",
    catalystPartNumber : "72036",
    cartridgeLength : 28.75,
    holeDiameter : 1,
    mmCartridgeDiameter : 23,
    inCartridgeDiameter : 0.8956692852835,
    groutVolume : 18.1143488170491,
    labelColor : "Green",
    expiration : "12 months (+/- 1 day) from date of manufacture",
    cartSpeed : "Medium",
    cartDiam : 23,
    speedIndex : "60",
    mixSpeed : 600,
    minLength : 28.75,
    stadardLength : 29,
    standardLinearDensity : 0.0479,
    standardWeightLbs : 1.3891,
    standardWeightGrams : 630.6514,
    masticPN : "M45",
    masticWeightLbs : 0.97237,
    pastePN : "72036",
    pastWeightLbs : 0.41673,
    clips : "12-8 4x1.25 Universal Clip",
    clipPN : "8509",
    innerFilm : "40mm142 gauge",
    innerFilmLength : 2.52083333333333,
    innerFilmPN : 8030,
    outerFilm : "84mm200 gauge",
    outerFilmLength : 2.52083333333333,
    outerfilmPN : 8032,
    boxDescription : "31\"-2pc",
    boxTopPN : "8445",
    boxBottomPN : "8446",
    boxWeight : 2.26,
    boxStraps : 2,
    shrinkWrapPN : "NA",
    shrinkWrapWeightGrams : 8.69295392849781,
    shrinkWrapWeightLbs : 0,
    volume : 740.586153302759,
    filmLength : 18.4,
    filmLengthWithAngle : 18.7671716936481,
    extraClipPN : "NA",
    xaShippingWeight : 1.54599722222222,
    palletSize : "44 x 44",
    palletWeight : 2226.236
}];

module.exports = {
  orders,
  populateOrders,
  resinSpecs,
  populateSpecs
};
