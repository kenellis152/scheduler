var mi = require('mongoimport');
var resindata = require('./packagingChart.json');

var config = {
  fields: resindata,
  db: 'SchedulerApp',
  collection: 'resinSpecs',
  host:'localhost:27017',
  callback: (err, db) => {
    if(err){
      consolog.log(err);
    } else {
      console.log('success');
    }
  }
}

mi(config);
