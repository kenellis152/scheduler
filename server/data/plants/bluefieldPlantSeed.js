require('./../../config/config');
var {Line} = require('./../../models/line');
var {Plant} = require('./../../models/plant');
var {mongoose} = require('./../../db/mongoose');
const {ObjectID} = require('mongodb');

const lineOneId = new ObjectID();
const lineTwoId = new ObjectID();
const lineThreeId = new ObjectID();
const lineFourId = new ObjectID();

var lines = [{
	_id: lineOneId,
	name: 'Line 1',
	activeShifts: 1,
	plant: 2,
	largeDiam: true,
	tooSpeedie: false
},
{
	_id: lineTwoId,
	name: 'Line 2',
	activeShifts: 1,
	plant: 2,
	largeDiam: true,
	tooSpeedie: false
},
{
	_id: lineThreeId,
	name: 'Line 3',
	activeShifts: 1,
	plant: 2,
	largeDiam: true,
	tooSpeedie: true
},
{
	_id: lineFourId,
	name: 'Line 4',
	activeShifts: 1,
	plant: 2,
	largeDiam: true,
	tooSpeedie: true
}];

var plant = new Plant({
	name: 'Bluefield',
	id: 2,
	numLines: 4,
	lines: [lineOneId.toHexString(), lineTwoId.toHexString(), lineThreeId.toHexString(), lineFourId.toHexString()]
})

Line.insertMany(lines).then( (result) => {
  if(!result) {
    console.log("failed to add lines ");
  } else {
  	console.log('lines added');
  }
  plant.save().then( (result) => {
  	if (!result) {
  		console.log('failed to save plant');
  	} else {
  		console.log('plant added');
  	}
  });
}).catch( (e) => {
  console.log(e);
});
