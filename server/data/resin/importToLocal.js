require('./../../config/config');
var resindata = require('./packagingChart.json');
var {mongoose} = require('./../../db/mongoose');
var {Spec} = require('./../../models/spec');

// console.log(resindata[0]);
console.log(process.env.MONGODB_URI)

Spec.insertMany(resindata).then( (result) => {
  if(!result) {
    console.log("failure1");
  }
  console.log('success');
}).catch( (e) => {
  console.log(e);
});


// var mi = require('mongoimport');
// var resindata = require('./packagingChart.json');
//
// var config = {
//   fields: resindata,
//   db: 'SchedulerApp',
//   collection: 'resinSpecs',
//   host:'localhost:27017',
//   callback: (err, db) => {
//     if(err){
//       consolog.log(err);
//     } else {
//       console.log('success');
//     }
//   }
// }
//
// mi(config);
