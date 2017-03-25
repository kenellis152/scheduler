var mongoose = require('mongoose');

var SpecSchema =  new mongoose.Schema({
  part: {
    type: Number
  },
  description: {
    type: String
  },
  plant: {
    type: String
  },
  clip: {
    type: String
  },
  boxSw: {
    type: String
  },
  piecesPerBundle: {
    type: Number
  },
  bundleWeight: {
    type: Number
  },
  numBoxes: {
    type: Number
  },
  palletCount: {
    type: Number
  },
  packagingCode: {
    type: Number
  },
  speed: {
    type: String
  },
  gelSpeed: {
    type: String
  },
  viscosity: {
    type: String
  },
  formulation: {
    type: String
  },
  masticPartNumber: {
    type: String
  },
  catalystPartNumber: {
    type: String
  },
  cartridgeLength: {
    type: Number
  },
  holeDiameter: {
    type: Number
  },
  mmCartridgeDiameter: {
    type: Number
  },
  inCartridgeDiameter: {
    type: Number
  },
  groutVolume: {
    type: Number
  },
  labelColor: {
    type: String
  },
  expiration: {
    type: String
  },
  cartSpeed: {
    type: String
  },
  cartDiam: {
    type: Number
  },
  speedIndex: {
    type: String
  },
  mixSpeed: {
    type: Number
  },
  minLength: {
    type: Number
  },
  stadardLength: {
    type: Number
  },
  standardLinearDensity: {
    type: Number
  },
  standardWeightLbs: {
    type: Number
  },
  standardWeightGrams: {
    type: Number
  },
  masticPN: {
    type: String
  },
  masticWeightLbs: {
    type: Number
  },
  pastePN: {
    type: String
  },
  pastWeightLbs: {
    type: Number
  },
  clips: {
    type: String
  },
  clipPN: {
    type: String
  },
  innerFilm: {
    type: String
  },
  innerFilmLength: {
    type: Number
  },
  innerFilmPN: {
    type: Number
  },
  outerFilm: {
    type: String
  },
  outerFilmLength: {
    type: Number
  },
  outerfilmPN: {
    type: Number
  },
  boxDescription: {
    type: String
  },
  boxTopPN: {
    type: String
  },
  boxBottomPN: {
    type: String
  },
  boxWeight: {
    type: Number
  },
  boxStraps: {
    type: Number
  },
  shrinkWrapPN: {
    type: String
  },
  shrinkWrapWeightGrams: {
    type: Number
  },
  shrinkWrapWeightLbs: {
    type: Number
  },
  volume: {
    type: Number
  },
  filmLength: {
    type: Number
  },
  filmLengthWithAngle: {
    type: Number
  },
  extraClipPN: {
    type: String
  },
  xaShippingWeight: {
    type: Number
  },
  palletSize: {
    type: String
  },
  palletWeight: {
    type: Number
  }
});
var Spec = mongoose.model('Spec', SpecSchema);



module.exports = {Spec};
