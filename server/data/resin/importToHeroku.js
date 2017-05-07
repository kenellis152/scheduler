require('./../../config/config');
var resindata = require('./packagingChart.json');
var {Spec} = require('./../../models/spec');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_l3p3wsld:v6l6nnhsv5sqpak01o9fja97ma@ds035856.mlab.com:35856/heroku_l3p3wsld');

Spec.remove({}).then( () => {
  console.log('succesfully removed specs');
  return Spec.insertMany(resindata).then( (result) => {
    if(!result) {
      console.log("failure1");
    }
    console.log('success');
  });
}).catch( (e) => {
  console.log('failed to remove specs', e);
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
